"use client";

import { useState, useMemo, useCallback } from "react";
import type { Question, QuestionSection } from "@/lib/questionnaires/a2p-compliance";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ui/ProgressBar";

interface FlatQuestion extends Question {
  sectionTitle: string;
  sectionDescription: string;
}

interface QuestionnaireWizardProps {
  sections: QuestionSection[];
  initialAnswers?: Record<string, string>;
  onSave: (answers: Record<string, string>, completed: boolean) => Promise<void>;
  onGenerate?: (answers: Record<string, string>) => Promise<void>;
  mode?: "full" | "client";
}

export default function QuestionnaireWizard({
  sections,
  initialAnswers = {},
  onSave,
  onGenerate,
  mode = "full",
}: QuestionnaireWizardProps) {
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const flatQuestions = useMemo<FlatQuestion[]>(() => {
    const result: FlatQuestion[] = [];
    for (const section of sections) {
      for (const q of section.questions) {
        if (mode === "client" && !q.clientFacing) continue;
        result.push({
          ...q,
          sectionTitle: section.title,
          sectionDescription: section.description,
        });
      }
    }
    return result;
  }, [sections, mode]);

  // Auto-skip to first unanswered question
  const firstUnanswered = useMemo(() => {
    for (let i = 0; i < flatQuestions.length; i++) {
      if (!initialAnswers[flatQuestions[i].id]) return i;
    }
    return 0;
  }, [flatQuestions, initialAnswers]);

  const [currentIndex, setCurrentIndex] = useState(firstUnanswered);

  const totalQuestions = flatQuestions.length;
  const currentQuestion = flatQuestions[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;

  function updateAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  function toggleMultiSelect(questionId: string, option: string) {
    const current = answers[questionId] ? answers[questionId].split("|||") : [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    updateAnswer(questionId, updated.join("|||"));
  }

  const autoSave = useCallback(async (a: Record<string, string>) => {
    try {
      await onSave(a, false);
    } catch {
      // Silent auto-save failure
    }
  }, [onSave]);

  function handleNext() {
    if (!isLast) {
      autoSave(answers);
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handlePrevious() {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleComplete() {
    setSaving(true);
    try {
      await onSave(answers, true);
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!onGenerate) return;
    setGenerating(true);
    try {
      await onGenerate(answers);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveDraft() {
    setSaving(true);
    try {
      await onSave(answers, false);
    } finally {
      setSaving(false);
    }
  }

  const showSectionHeader =
    currentIndex === 0 ||
    flatQuestions[currentIndex - 1]?.sectionTitle !== currentQuestion?.sectionTitle;

  if (!currentQuestion) return null;

  return (
    <div className="space-y-6">
      <ProgressBar
        current={currentIndex + 1}
        total={totalQuestions}
        label={`Question ${currentIndex + 1} of ${totalQuestions}`}
      />

      {showSectionHeader && (
        <div className="px-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">
            {currentQuestion.sectionTitle}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentQuestion.sectionDescription}
          </p>
        </div>
      )}

      <Card className="p-8">
        <div className="min-h-[200px]">
          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id] || ""}
            answers={answers}
            onUpdate={updateAnswer}
            onToggleMulti={toggleMultiSelect}
            selectedMulti={
              currentQuestion.type === "multi-select"
                ? (answers[currentQuestion.id] || "").split("|||").filter(Boolean)
                : []
            }
          />
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <div className="flex gap-2">
            {!isFirst && (
              <Button variant="outline" onClick={handlePrevious}>
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Previous
              </Button>
            )}
            <Button variant="ghost" onClick={handleSaveDraft} disabled={saving}>
              {saving ? "Saving..." : "Save Draft"}
            </Button>
          </div>

          <div className="flex gap-2">
            {isLast ? (
              <>
                <Button variant="secondary" onClick={handleComplete} disabled={saving}>
                  {saving ? "Completing..." : "Complete"}
                </Button>
                {onGenerate && (
                  <Button onClick={handleGenerate} disabled={generating}>
                    {generating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      "Generate Documents"
                    )}
                  </Button>
                )}
              </>
            ) : (
              <Button onClick={handleNext}>
                Next
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

function QuestionRenderer({
  question,
  value,
  answers,
  onUpdate,
  onToggleMulti,
  selectedMulti,
}: {
  question: FlatQuestion;
  value: string;
  answers: Record<string, string>;
  onUpdate: (id: string, value: string) => void;
  onToggleMulti: (id: string, option: string) => void;
  selectedMulti: string[];
}) {
  const [suggesting, setSuggesting] = useState(false);

  async function handleAiSuggest() {
    setSuggesting(true);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          businessContext: {
            "Business Name": answers.legal_business_name || "",
            "Business Type": answers.has_dba === "Yes" ? `${answers.legal_business_name} (DBA: ${answers.dba_names})` : answers.legal_business_name || "",
            "Website": answers.primary_website || "",
            "Business Address": answers.business_address || "",
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdate(question.id, data.suggestion);
      }
    } catch {
      // Silent failure
    } finally {
      setSuggesting(false);
    }
  }

  const aiButton = question.aiSuggest && !value && (
    <button
      type="button"
      onClick={handleAiSuggest}
      disabled={suggesting}
      className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium cursor-pointer disabled:opacity-50"
    >
      {suggesting ? (
        <>
          <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Writing...
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
          </svg>
          Write with AI
        </>
      )}
    </button>
  );

  if (question.type === "text") {
    return (
      <div className="space-y-2">
        <Input
          label={question.question}
          placeholder={question.placeholder}
          helperText={question.helperText}
          value={value}
          onChange={(e) => onUpdate(question.id, e.target.value)}
          required={question.required}
        />
        {aiButton}
      </div>
    );
  }

  if (question.type === "textarea") {
    return (
      <div className="space-y-2">
        <Textarea
          label={question.question}
          placeholder={question.placeholder}
          helperText={question.helperText}
          value={value}
          onChange={(e) => onUpdate(question.id, e.target.value)}
          required={question.required}
        />
        {aiButton}
      </div>
    );
  }

  if (question.type === "select") {
    const isOtherSelected = question.allowOther && value && !question.options?.includes(value);
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-700">
          {question.question}
        </label>
        <select
          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none text-sm bg-white"
          value={isOtherSelected ? "__other__" : value}
          onChange={(e) => {
            if (e.target.value === "__other__") {
              onUpdate(question.id, "");
            } else {
              onUpdate(question.id, e.target.value);
            }
          }}
        >
          <option value="">Select an option...</option>
          {question.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          {question.allowOther && <option value="__other__">Other (type your own)</option>}
        </select>
        {(isOtherSelected || (question.allowOther && value === "")) && value !== undefined && (
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none text-sm mt-2"
            placeholder="Type your answer..."
            value={isOtherSelected ? value : ""}
            onChange={(e) => onUpdate(question.id, e.target.value)}
            autoFocus
          />
        )}
        {question.helperText && (
          <p className="text-xs text-slate-500">{question.helperText}</p>
        )}
      </div>
    );
  }

  if (question.type === "multi-select") {
    // Find any "other" values that aren't in the predefined options
    const otherValues = selectedMulti.filter(
      (v) => v && !question.options?.includes(v)
    );
    const hasOtherInput = question.allowOther;

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-700">
          {question.question}
        </label>
        <div className="flex flex-wrap gap-2">
          {question.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onToggleMulti(question.id, opt)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                selectedMulti.includes(opt)
                  ? "bg-teal-50 border-teal-300 text-teal-700"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {selectedMulti.includes(opt) && (
                <span className="mr-1.5">&#10003;</span>
              )}
              {opt}
            </button>
          ))}
        </div>
        {hasOtherInput && (
          <div className="mt-2">
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none text-sm"
              placeholder="Other — type your own and press Enter"
              value=""
              onChange={() => {}}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const input = e.currentTarget;
                  const val = input.value.trim();
                  if (val && !selectedMulti.includes(val)) {
                    onToggleMulti(question.id, val);
                  }
                  input.value = "";
                }
              }}
            />
            {otherValues.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {otherValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onToggleMulti(question.id, val)}
                    className="px-3 py-2 rounded-lg text-sm font-medium border bg-teal-50 border-teal-300 text-teal-700 cursor-pointer"
                  >
                    <span className="mr-1.5">&#10003;</span>
                    {val}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {question.helperText && (
          <p className="text-xs text-slate-500">{question.helperText}</p>
        )}
      </div>
    );
  }

  return null;
}
