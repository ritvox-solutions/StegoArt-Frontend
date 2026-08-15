import { Link } from "react-router-dom";

const steps = [
  { n: "1", title: "Upload a cover image", desc: "Any everyday JPEG, PNG, or WEBP photo — this is what carries the hidden data." },
  { n: "2", title: "Hide or extract", desc: "A CNN autoencoder embeds a secret invisibly, or recovers one already hidden inside an image." },
  { n: "3", title: "Optionally restyle", desc: "Repaint the result in an artistic style — purely visual, applied after the secret is safely embedded." },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <section className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand">CNN Steganography · Neural Style Transfer</p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Hide data inside images,
          <br />
          <span className="brand-gradient-text">invisibly.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted sm:text-lg">
          A trained encoder/decoder pair embeds text or an image inside an ordinary cover photo — imperceptible to
          the eye, recoverable on demand. An optional neural style transfer step can restyle the result afterward,
          purely for presentation.
        </p>
      </section>

      <section className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2">
        <Link
          to="/hide"
          className="group rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-brand-from focus-visible:border-brand-from sm:p-8"
        >
          <span className="brand-gradient-bg inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl" aria-hidden="true">
            🔒
          </span>
          <h2 className="mt-5 text-xl font-bold">Hide Data</h2>
          <p className="mt-2 text-sm text-text-muted">
            Embed a text message or an image inside a cover photo, with an optional artistic style applied on top.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
            Start hiding <span aria-hidden="true">→</span>
          </span>
        </Link>

        <Link
          to="/extract"
          className="group rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-brand-from focus-visible:border-brand-from sm:p-8"
        >
          <span className="brand-gradient-bg inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl" aria-hidden="true">
            🔓
          </span>
          <h2 className="mt-5 text-xl font-bold">Extract Data</h2>
          <p className="mt-2 text-sm text-text-muted">
            Upload a plain (unstyled) stego image and recover the text or image hidden inside it.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand group-hover:gap-2 transition-all">
            Start extracting <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>

      <section className="mt-16 sm:mt-24">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-text-muted">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-border-subtle bg-surface p-6">
              <span className="brand-gradient-text text-2xl font-extrabold">{s.n}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-text-faint">
          Curious how the models actually work? See the <Link to="/about" className="text-brand hover:underline">About page</Link>.
        </p>
      </section>
    </div>
  );
}
