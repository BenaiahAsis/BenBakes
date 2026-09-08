'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SiteSettings } from '@/lib/types';

type EditableFields = Omit<SiteSettings, 'id' | 'updated_at'>;

interface SettingsFormProps {
  settings: SiteSettings;
}

const FIELDS: { key: keyof EditableFields; label: string; multiline?: boolean; placeholder?: string }[] = [
  { key: 'business_name', label: 'Business name', placeholder: 'Sweet Crumbs' },
  { key: 'tagline', label: 'Tagline', placeholder: 'Home-baked cakes and pastries…' },
  { key: 'messenger_username', label: 'Facebook Messenger username', placeholder: 'mybakeryph' },
  { key: 'instagram_handle', label: 'Instagram handle', placeholder: '@mybakeryph' },
  { key: 'viber_number', label: 'Viber number', placeholder: '+639XXXXXXXXX' },
  { key: 'whatsapp_number', label: 'WhatsApp number', placeholder: '+639XXXXXXXXX' },
  { key: 'address', label: 'Address / area', placeholder: 'Quezon City, Metro Manila' },
  { key: 'hours_text', label: 'Hours / availability', placeholder: 'Mon–Sat, 8am–6pm' },
  { key: 'lead_time_text', label: 'Lead time notice', multiline: true, placeholder: 'Custom cakes need at least 5 days notice…' },
  { key: 'delivery_text', label: 'Delivery & pickup info', multiline: true, placeholder: 'Pickup from our home kitchen in…' },
  { key: 'payment_text', label: 'Payment methods', multiline: true, placeholder: 'GCash, Maya, or cash on pickup…' },
  { key: 'storage_text', label: 'Storage instructions', multiline: true, placeholder: 'Keep refrigerated…' },
  { key: 'about_text', label: 'About / bio', multiline: true, placeholder: "Hi! I'm a home baker who…" },
];

export default function SettingsForm({ settings }: SettingsFormProps) {
  const [form, setForm] = useState<EditableFields>({
    business_name: settings.business_name,
    tagline: settings.tagline ?? '',
    address: settings.address ?? '',
    hours_text: settings.hours_text ?? '',
    lead_time_text: settings.lead_time_text ?? '',
    delivery_text: settings.delivery_text ?? '',
    payment_text: settings.payment_text ?? '',
    storage_text: settings.storage_text ?? '',
    about_text: settings.about_text ?? '',
    messenger_username: settings.messenger_username ?? '',
    instagram_handle: settings.instagram_handle ?? '',
    viber_number: settings.viber_number ?? '',
    whatsapp_number: settings.whatsapp_number ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload: Partial<EditableFields> = {};
    for (const key of Object.keys(form) as (keyof EditableFields)[]) {
      const val = form[key];
      (payload as Record<string, string | null>)[key] = val?.toString().trim() || null;
    }
    // business_name must not be null
    payload.business_name = form.business_name || 'Sweet Crumbs';

    const { error: err } = await supabase
      .from('site_settings')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (err) {
      setError('Failed to save settings. Please try again.');
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  function set(key: keyof EditableFields, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl flex flex-col gap-5">
      <h1
        className="font-display text-3xl font-bold mb-2"
        style={{ color: 'var(--ganache)', fontVariationSettings: "'SOFT' 100" }}
      >
        Settings
      </h1>

      {FIELDS.map(({ key, label, multiline, placeholder }) => (
        <div key={key}>
          <label className="label" htmlFor={key}>{label}</label>
          {multiline ? (
            <textarea
              id={key}
              className="input"
              rows={3}
              placeholder={placeholder}
              value={(form[key] as string) ?? ''}
              onChange={(e) => set(key, e.target.value)}
            />
          ) : (
            <input
              id={key}
              type="text"
              className="input"
              placeholder={placeholder}
              value={(form[key] as string) ?? ''}
              onChange={(e) => set(key, e.target.value)}
            />
          )}
        </div>
      ))}

      {error && <p className="field-error">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" className="btn-berry" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {saved && (
          <p className="text-sm font-medium" style={{ color: 'var(--pistachio)', fontFamily: "'Work Sans', sans-serif" }}>
            ✓ Saved!
          </p>
        )}
      </div>
    </form>
  );
}
