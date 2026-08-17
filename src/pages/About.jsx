const sections = [
  {
    title: "What is steganography?",
    body: (
      <>
        <p>
          Steganography means hiding information inside something else so the hiding itself isn't obvious — unlike
          encryption, which scrambles a message but leaves it visibly a "secret message," steganography tries to make
          the secret invisible in the first place. Here, the secret (a short text message) is hidden inside an
          everyday cover photo. To the eye, the resulting "stego image" looks just like the original photo.
        </p>
      </>
    ),
  },
  {
    title: "How the hiding actually works",
    body: (
      <>
        <p>
          This system uses two small neural networks, trained together, that never touch each other's job:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <span className="font-semibold text-text">The Hiding Network</span> looks at the cover photo and the
            secret at the same time, and learns to blend the secret into the cover so subtly that the output is
            visually almost identical to the original photo.
          </li>
          <li>
            <span className="font-semibold text-text">The Reveal Network</span> does the opposite: given only the
            stego image (no access to the original cover), it learns to pull the hidden secret back out.
          </li>
        </ul>
        <p className="mt-3">
          Both networks are convolutional neural networks (CNNs) — the same broad family of model used for most
          modern image recognition — trained together on thousands of example photos until the Hiding Network gets
          good at concealing and the Reveal Network gets good at recovering, at the same time. The message is first
          turned into a simple grid of on/off values before it's embedded, so both ends agree on exactly one shared
          format.
        </p>
      </>
    ),
  },
  {
    title: "How good is the hiding, really?",
    body: (
      <>
        <p>
          After hiding a secret, this tool measures how close the stego image is to the original cover using two
          standard image-quality metrics: <span className="font-semibold text-text">PSNR</span> (a signal-strength
          comparison, in decibels — higher means less visible change) and{" "}
          <span className="font-semibold text-text">SSIM</span> (a structural-similarity score from 0 to 1 — closer
          to 1 means the two images look virtually the same). Both are shown after every Hide operation so you can
          judge the result yourself rather than take it on faith.
        </p>
      </>
    ),
  },
  {
    title: "What neural style transfer adds",
    body: (
      <>
        <p>
          Separately from hiding data, this tool can also repaint the stego image in an artistic style — turning it
          into something that looks like a mosaic, a candy-colored abstract painting, and so on — using a technique
          called <span className="font-semibold text-text">feed-forward neural style transfer</span>. A small network
          is trained in advance on one specific artistic style; afterward, restyling any new photo is a single fast
          pass through that network (well under a second), not a slow trial-and-error optimization process.
        </p>
        <p className="mt-3">
          This is purely a visual, presentational step, applied <em>after</em> the secret is already safely hidden —
          it never influences what gets hidden or how.
        </p>
      </>
    ),
  },
  {
    title: "Why styling and extraction don't mix",
    body: (
      <>
        <p>
          Style transfer repaints essentially every pixel in the image, which unavoidably destroys the extremely
          subtle pixel-level pattern the Reveal Network relies on to find the hidden secret. In practice, this was
          measured directly: trying to extract a secret from a styled image collapses recovery accuracy to roughly
          the level of random guessing, across every style this tool offers. Because of this, the styled image is
          meant to be shared or admired as art — extraction should always be done from the original, unstyled stego
          image.
        </p>
      </>
    ),
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-2xl font-bold sm:text-3xl">About StegoArt</h1>
      <p className="mt-2 text-text-muted">
        A plain-language walkthrough of what this tool does and how it works — no equations required.
      </p>

      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-bold text-text">{s.title}</h2>
            <div className="mt-2 text-sm leading-relaxed text-text-muted">{s.body}</div>
          </section>
        ))}
      </div>
    </div>
  );
}
