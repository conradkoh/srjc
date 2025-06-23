'use client';

import { Input } from '@/components/ui/input';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface ChecklistInlineInputProps {
  onSubmit: (text: string) => Promise<boolean>;
  getAndClearFailedText?: () => string | null;
  placeholder?: string;
  className?: string;
}

export function ChecklistInlineInput({
  onSubmit,
  getAndClearFailedText,
  placeholder = 'Add new item...',
  className,
}: ChecklistInlineInputProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldFocus, setShouldFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check for failed text on mount and when getAndClearFailedText changes
  useEffect(() => {
    if (getAndClearFailedText) {
      const failedText = getAndClearFailedText();
      if (failedText) {
        setText(failedText);
        // Focus the input to draw attention to the recovered text
        setTimeout(() => {
          inputRef.current?.focus();
          inputRef.current?.setSelectionRange(failedText.length, failedText.length);
        }, 100);
      }
    }
  }, [getAndClearFailedText]);

  // Focus after successful submission (when text is cleared)
  useLayoutEffect(() => {
    if (shouldFocus && text === '' && !isSubmitting) {
      inputRef.current?.focus();
      setShouldFocus(false);
    }
  }, [text, shouldFocus, isSubmitting]);

  const handleSubmit = useCallback(async () => {
    // Allow submission even if another is in progress, but prevent empty submissions
    if (!text.trim()) return;

    const currentText = text.trim();
    setIsSubmitting(true);

    // Clear the text immediately to allow new input
    setText('');
    setShouldFocus(true);

    try {
      const success = await onSubmit(currentText);
      if (!success) {
        // If submission failed, restore the text
        setText(currentText);
        setShouldFocus(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [text, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={className}>
      <Input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="border-dashed border-gray-300 focus:border-solid focus:border-gray-400 focus:ring-2 focus:ring-offset-1"
      />
    </div>
  );
}
