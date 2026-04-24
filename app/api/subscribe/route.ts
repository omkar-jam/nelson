import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value?.trim() ?? '');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const name = typeof body.name === 'string' ? body.name.trim() : null;
    const countryCode = typeof body.countryCode === 'string' ? body.countryCode.trim() : '+44';
    const phoneRaw = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '').trim() : '';
    const code = (countryCode && String(countryCode).startsWith('+')) ? String(countryCode).trim() : `+${(countryCode || '44').replace(/\D/g, '')}`;
    const phone = phoneRaw ? `${code} ${phoneRaw}` : null;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    await prisma.subscriber.upsert({
      where: { email },
      create: { email, name: name || null, phone, unsubscribed: false },
      update: {
        ...(name != null && name !== '' && { name }),
        ...(phone != null && { phone }),
        unsubscribed: false,
        updatedAt: new Date(),
      },
    });

    const artistEmail = process.env.ARTIST_EMAIL;
    if (artistEmail) {
      try {
        const nameLine = name ? `\nName: ${name}` : '';
        const nameLineHtml = name ? `<p><strong>Name:</strong> ${name}</p>` : '';
        const phoneLine = phone ? `\nPhone: ${phone}` : '';
        const phoneLineHtml = phone ? `<p><strong>Phone:</strong> ${phone}</p>` : '';
        await sendMail({
          to: artistEmail,
          subject: '[Mailing list] New subscriber',
          text: `A new person joined your mailing list:\n\nEmail: ${email}${nameLine}${phoneLine}`,
          html: `<p>A new person joined your mailing list:</p><p><a href="mailto:${email}">${email}</a></p>${nameLineHtml}${phoneLineHtml}`,
        });
      } catch (err) {
        console.error('Subscribe: failed to notify artist:', err);
      }
    }

    // Confirmation email to the new subscriber
    try {
      const greeting = name ? `Hi ${name},` : 'Hello,';
      const confirmText = `${greeting}\n\nYou're on the list.\n\nI'll text you when I've received your signup. You'll also get occasional updates on my work and projects — unsubscribe anytime.\n\nBest,\nNelson Ferreira`;
      const confirmHtml = `<p>${greeting}</p><p>You're on the list.</p><p>I'll text you when I've received your signup. You'll also get occasional updates on my work and projects — unsubscribe anytime.</p><p>Best,<br>Nelson Ferreira</p>`;
      await sendMail({
        to: email,
        subject: "You're on the list — Nelson Ferreira",
        text: confirmText,
        html: confirmHtml,
      });
    } catch (err) {
      console.error('Subscribe: failed to send confirmation email:', err);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Subscribe error:', e);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
