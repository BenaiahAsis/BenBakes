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
    if (!form.occasion.trim()) errs.occasion = 'Please specify the occasion or event.';
    if (!form.servings.trim()) errs.servings = 'Please select approximate quantity.';
    if (!form.dateNeeded) errs.dateNeeded = 'Please select the date needed.';
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
      setTimeout(() => setCopied(false), 2500);
    });
  }

  // Minimum date = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (status === 'done') {
    return (
      <div
        className="clay-card p-8 sm:p-10 text-center max-w-lg mx-auto"
        style={{ background: '#FFF9EE' }}
      >
        <div className="clay-badge w-16 h-16 mx-auto flex items-center justify-center text-3xl mb-4 bg-[#E7EBDA]">
          🎉
        </div>
        <h2
          className="font-display text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
        >
          Request Saved!
        </h2>
        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
          Your custom order details have been recorded. You can now tap below to open Messenger, or copy the order details to paste into your chat.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={messengerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="clay-btn py-3 justify-center text-center font-bold text-white flex items-center gap-2"
            style={{ background: 'var(--berry)', textDecoration: 'none' }}
          >
            <span>💬</span> Open Facebook Messenger
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className={`clay-btn-secondary py-3 justify-center font-bold flex items-center gap-2 ${
              copied ? 'active' : ''
            }`}
            style={{
              background: copied ? 'var(--pistachio)' : '#FFF3DD',
              color: copied ? '#ffffff' : 'var(--ganache)',
            }}
          >
            <span>{copied ? '✓' : '📋'}</span>
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Order Text'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="clay-card-flat p-6 sm:p-10 max-w-2xl mx-auto flex flex-col gap-6"
      style={{ background: '#FFF9EE' }}
    >
      <div className="border-b pb-4" style={{ borderColor: 'rgba(230, 217, 194, 0.7)' }}>
        <h2
          className="font-display text-2xl font-bold"
          style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
        >
          Order Details 🍪
        </h2>
        <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--ink-soft)', fontFamily: "'Work Sans', sans-serif" }}>
          Fill out what you have in mind. You can copy the generated order summary anytime!
        </p>
      </div>

      {/* Customer Name */}
      <div>
        <label htmlFor="customerName" className="label text-sm font-bold" style={{ color: 'var(--ganache)' }}>
          Your Name *
        </label>
        <input
          id="customerName"
          type="text"
          className="clay-input w-full px-4 py-3"
          placeholder="e.g. Maria Santos"
          value={form.customerName}
          onChange={set('customerName')}
          autoComplete="name"
        />
        {errors.customerName && <p className="field-error text-xs font-semibold mt-1">{errors.customerName}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Occasion */}
        <div>
          <label htmlFor="occasion" className="label text-sm font-bold" style={{ color: 'var(--ganache)' }}>
            Occasion / Event *
          </label>
          <select
            id="occasion"
            className="clay-input w-full px-4 py-3 cursor-pointer"
            value={form.occasion}
            onChange={set('occasion')}
          >
            <option value="">Select an occasion…</option>
            <option>Birthday</option>
            <option>Gift Box / Token</option>
            <option>Party / Celebration</option>
            <option>Office / Corporate Batch</option>
            <option>Wedding / Souvenir</option>
            <option>Just Craving Fresh Cookies</option>
            <option>Other</option>
          </select>
          {errors.occasion && <p className="field-error text-xs font-semibold mt-1">{errors.occasion}</p>}
        </div>

        {/* Quantity / Servings */}
        <div>
          <label htmlFor="servings" className="label text-sm font-bold" style={{ color: 'var(--ganache)' }}>
            Quantity / Batch Size *
          </label>
          <select
            id="servings"
            className="clay-input w-full px-4 py-3 cursor-pointer"
            value={form.servings}
            onChange={set('servings')}
          >
            <option value="">How many pieces?</option>
            <option>1 Box (6 pcs)</option>
            <option>2 Boxes (12 pcs)</option>
            <option>3–4 Boxes (18–24 pcs)</option>
            <option>5+ Boxes (30+ pcs)</option>
            <option>Bulk / Custom Assortment</option>
          </select>
          {errors.servings && <p className="field-error text-xs font-semibold mt-1">{errors.servings}</p>}
        </div>
      </div>

      {/* Flavor Selection */}
      <div>
        <label htmlFor="flavor" className="label text-sm font-bold" style={{ color: 'var(--ganache)' }}>
          Preferred Flavors or Mix
        </label>
        <input
          id="flavor"
          type="text"
          className="clay-input w-full px-4 py-3"
          placeholder="e.g. Red Velvet, Chocolate Chip, Matcha, S'mores sampler"
          value={form.flavor}
          onChange={set('flavor')}
        />
      </div>

      {/* Date needed */}
      <div>
        <label htmlFor="dateNeeded" className="label text-sm font-bold" style={{ color: 'var(--ganache)' }}>
          Date Needed *
        </label>
        <input
          id="dateNeeded"
          type="date"
          className="clay-input w-full px-4 py-3 cursor-pointer"
          min={minDate}
          value={form.dateNeeded}
          onChange={set('dateNeeded')}
        />
        {errors.dateNeeded && <p className="field-error text-xs font-semibold mt-1">{errors.dateNeeded}</p>}
      </div>

      {/* Special Notes / Requests */}
      <div>
        <label htmlFor="designNotes" className="label text-sm font-bold" style={{ color: 'var(--ganache)' }}>
          Special Instructions or Notes
        </label>
        <textarea
          id="designNotes"
          className="clay-input w-full px-4 py-3"
          placeholder="e.g. Include a personalized note card, ribbon packaging, or specific delivery preferences in Bacolod"
          value={form.designNotes}
          onChange={set('designNotes')}
          rows={3}
        />
      </div>

      {/* Live Order Preview & Copy Box */}
      {(form.customerName || form.occasion || form.servings) && (
        <div
          className="clay-card p-5 text-sm"
          style={{ background: '#FFFDF8' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--pistachio)]">
              Pre-filled Message Preview
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="clay-pill px-3 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer"
              style={{
                background: copied ? 'var(--pistachio)' : '#FFF0D9',
                color: copied ? '#ffffff' : 'var(--ink)',
              }}
            >
              <span>{copied ? '✓' : '📋'}</span>
              <span>{copied ? 'Copied!' : 'Copy Preview'}</span>
            </button>
          </div>
          <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed opacity-85">
            {message}
          </p>
        </div>
      )}

      {status === 'error' && (
        <p className="field-error text-center text-sm font-semibold">
          Could not save to the database. You can still tap &quot;Copy Order Text&quot; or message us directly!
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          className="clay-btn flex-1 py-3.5 justify-center font-bold text-white flex items-center gap-2"
          style={{ background: 'var(--berry)' }}
          disabled={status === 'saving'}
        >
          <span>💬</span>
          <span>{status === 'saving' ? 'Saving…' : 'Save & Open Messenger'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="clay-btn-secondary flex-1 py-3.5 justify-center font-bold flex items-center gap-2"
          style={{
            background: copied ? 'var(--pistachio)' : '#FFF3DD',
            color: copied ? '#ffffff' : 'var(--ganache)',
          }}
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Order Text'}</span>
        </button>
      </div>
    </form>
  );
}
