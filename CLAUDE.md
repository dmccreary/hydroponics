# CLAUDE.md — Hydroponics Textbook

Project-specific instructions for Claude Code working in this repository.
Global rules are in `~/.claude/CLAUDE.md`.

---

## Project Overview

**Book:** Hydroponics: From Mason Jar to Vertical Farm
**Audience:** Advanced high-school and college students
**Site URL:** https://dmccreary.github.io/hydroponics/
**Palette:** Green primary (`#2e7d32`), Teal accent (`#00bcd4`)
**MkDocs theme:** Material, community edition (no Insiders features)

---

## Learning Mascot: Cress the Tree Frog

### Mascot File Index

The canonical files for this mascot. When editing any of these, update the
others in the same turn so they stay in sync.

| File | Purpose |
|------|---------|
| [`docs/img/mascot/character-sheet.md`](docs/img/mascot/character-sheet.md) | Canonical identity document (name, species, colors, voice). Source of truth. |
| [`docs/img/mascot/image-prompts.md`](docs/img/mascot/image-prompts.md) | Self-contained AI prompts for regenerating each pose. |
| [`docs/img/mascot/neutral.png`](docs/img/mascot/neutral.png) | Default / general-purpose pose. |
| [`docs/img/mascot/welcome.png`](docs/img/mascot/welcome.png) | Chapter-opening pose. |
| [`docs/img/mascot/thinking.png`](docs/img/mascot/thinking.png) | Key-concept pose. |
| [`docs/img/mascot/tip.png`](docs/img/mascot/tip.png) | Hint / helpful-guidance pose. |
| [`docs/img/mascot/warning.png`](docs/img/mascot/warning.png) | Common-mistake / pitfall pose. |
| [`docs/img/mascot/encouraging.png`](docs/img/mascot/encouraging.png) | Difficult-content / struggle pose. |
| [`docs/img/mascot/celebration.png`](docs/img/mascot/celebration.png) | End-of-chapter / achievement pose. |
| [`docs/css/mascot.css`](docs/css/mascot.css) | Custom admonition styles for the seven pose contexts. |
| [`docs/learning-graph/mascot-test.md`](docs/learning-graph/mascot-test.md) | Rendering test page that exercises every admonition style. |

### Character Overview

- **Name**: Cress
- **Species**: Tree Frog
- **Personality**: curious, fun-loving, playful, humorous, encouraging, precise, enthusiastic about science
- **Catchphrase**: "Let's grow something amazing!"
- **Visual**: Small bright-green tree frog (#4caf50) with teal/blue belly (#00bcd4), small lab goggles pushed up on head, expressive free hands, flat cartoon vector style

### Voice Characteristics

- Speaks with playful energy; never stuffy or lecture-y
- Drops hydroponics and plant puns naturally ("That's nutrient-level cool!")
- Refers to readers as "growers" or "hydro-explorers"
- Signature phrases: "Let's grow something amazing!", "Root for it!", "That's nutrient-level cool!"

### Mascot Admonition Format

Always place mascot images in the admonition body, never in the title bar:

```markdown
!!! mascot-welcome "Title Here"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Cress waving welcome">
    Admonition text goes here after the img tag.
```

**Image path rule:** The `src` path is relative to the rendered page URL
(MkDocs uses directory URLs). Count `../` levels from the rendered page
to `docs/img/mascot/`:

- Page at `chapters/01-intro/index.md` → `../../img/mascot/`
- Page at `learning-graph/mascot-test.md` → `../../img/mascot/`
- Page at root `index.md` → `img/mascot/`

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Every chapter |
| Key concept | `mascot-thinking` | 2–3 per chapter |
| Helpful tip | `mascot-tip` | As needed |
| Common mistake | `mascot-warning` | As needed |
| Difficult content | `mascot-encourage` | Where students may struggle |
| Chapter completion | `mascot-celebration` | End of every chapter |

### Do's and Don'ts

**Do:**
- Use Cress to introduce new topics warmly
- Include the catchphrase in welcome admonitions
- Keep dialogue brief (1–3 sentences)
- Match the pose image to the content type

**Don't:**
- Use Cress more than 5–6 times per chapter
- Put mascot admonitions back-to-back
- Use gendered pronouns — always refer to "Cress" or use "they/them"
- Change Cress's personality or speech patterns
