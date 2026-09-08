'use client';

import { useState } from 'react';
import { buildMessengerUrl, buildCustomOrderMessage } from '@/lib/messenger';

interface FormState {
  customerName: string;
  occasion: string;
  servings: string;
  flavor: string;
  designNotes: string;
  dateNeeded: string;
}

const EMPTY: FormState = {
  customerName: '',
  occasion: '',
  servings: '',
  flavor: '',
  designNotes: '',
  dateNeeded: '',
};

interface CustomOrderFormProps {
  messengerUsername: string;
}

export default function CustomOrderForm({ messengerUsername }: CustomOrderFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const message = buildCustomOrderMessage(form);
  const messengerUrl = buildMessengerUrl(messengerUsername, message);

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }));
    };
  }

  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (!form.customerName.trim()) errs.customerName = 'Please enter your name.';
    if (!form.occasion.trim()) errs.occasion = 'Please tell us the occasion.';
    if (!form.servings.trim()) errs.servings = 'Please enter approximate servings.';
    if (!form.dateNeeded) errs.dateNeeded = 'Please pick a date.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus('saving');
    try {
      const res = await fetch('/api/custom-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Save failed');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Minimum date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (status === 'done') {
    return (
      <div
        className="card p-8 text-center max-w-lg mx-auto"
        style={{ borderColor: 'var(--pistachio)' }}
      >
        <div className="text-4xl mb-3">🎉</div>
        <h2
          className="font-display text-2xl font-bold mb-2"
          style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
        >
          Request saved!
        </h2>
        <p className="mb-6 text-sm" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
          Your order details are saved. Now send me a message on Messenger so we can confirm everything:
        </p>
        <div className="flex flex-col gap-3">
          <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className="btn-berry justify-center">
            💬 Open Messenger
          </a>
          <button onClick={handleCopy} className="btn-ghost justify-center">
            {copied ? '✓ Copied!' : '📋 Copy message text'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Name */}
      <div>
        <label htmlFor="customerName" className="label">Your name *</label>
        <input
          id="customerName"
          type="text"
          className="input"
          placeholder="e.g. Maria Santos"
          value={form.customerName}
          onChange={set('customerName')}
          autoComplete="name"
        />
        {errors.customerName && <p className="field-error">{errors.customerName}</p>}
      </div>

      {/* Occasion */}
      <div>
        <label htmlFor="occasion" className="label">Occasion *</label>
        <select id="occasion" className="input" value={form.occasion} onChange={set('occasion')}>
          <option value="">Select an occasion…</option>
          <option>Birthday</option>
          <option>Anniversary</option>
          <option>Wedding</option>
          <option>Graduation</option>
          <option>Baby Shower</option>
          <option>Christening</option>
          <option>Just Because</option>
          <option>Other</option>
        </select>
        {errors.occasion && <p className="field-error">{errors.occasion}</p>}
      </div>

      {/* Servings */}
      <div>
        <label htmlFor="servings" className="label">Approximate servings *</label>
        <select id="servings" className="input" value={form.servings} onChange={set('servings')}>
          <option value="">How many people?</option>
          <option>6–8 pax</option>
          <option>10–12 pax</option>
          <option>15–20 pax</option>
          <option>25–30 pax</option>
          <option>50+ pax</option>
        </select>
        {errors.servings && <p className="field-error">{errors.servings}</p>}
      </div>

      {/* Flavor */}
      <div>
        <label htmlFor="flavor" className="label">Preferred flavor / base</label>
        <input
          id="flavor"
          type="text"
          className="input"
          placeholder="e.g. Ube, Chocolate, Vanilla"
          value={form.flavor}
          onChange={set('flavor')}
        />
      </div>

      {/* Design notes */}
      <div>
        <label htmlFor="designNotes" className="label">Design / decoration notes</label>
        <textarea
          id="designNotes"
          className="input"
          placeholder="Describe the look you're going for, colors, any text on the cake, inspo photos you'll send, etc."
          value={form.designNotes}
          onChange={set('designNotes')}
          rows={4}
        />
      </div>

      {/* Date needed */}
      <div>
        <label htmlFor="dateNeeded" className="label">Date needed *</label>
        <input
          id="dateNeeded"
          type="date"
          className="input"
          min={minDate}
          value={form.dateNeeded}
          onChange={set('dateNeeded')}
        />
        {errors.dateNeeded && <p className="field-error">{errors.dateNeeded}</p>}
      </div>

      {/* Message preview */}
      {(form.customerName || form.occasion) && (
        <div
          className="rounded-xl border p-4 text-sm whitespace-pre-wrap"
          style={{
            background: 'var(--pistachio-bg)',
            borderColor: 'var(--pistachio)',
            color: 'var(--pistachio)',
            fontFamily: "'Work Sans', sans-serif",
          }}
        >
          <p className="font-semibold mb-1 text-xs" style={{ color: 'var(--pistachio)' }}>
            Preview of what will be sent:
          </p>
          {message}
        </div>
      )}

      {status === 'error' && (
        <p className="field-error text-center">
          Something went wrong saving your request. Please try again, or just tap "Open Messenger" below.
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          className="btn-berry flex-1 justify-center"
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving…' : '💬 Save & open Messenger'}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="btn-ghost flex-1 justify-center"
        >
          {copied ? '✓ Copied!' : '📋 Copy message text'}
        </button>
      </div>
    </form>
  );
}
