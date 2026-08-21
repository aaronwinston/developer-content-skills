---
name: local-excalidraw
description: >-
  Create simple Excalidraw diagrams locally from a post, outline, or rough
  idea. No API key. Use when the user asks to draw, diagram, sketch, or
  illustrate a concept as a .excalidraw file.
---

# Local Excalidraw diagrams

Create simple `.excalidraw` JSON files. No API key. The user opens the file on [excalidraw.com](https://excalidraw.com) (drag-and-drop) or in the Excalidraw editor.

## Output

Write to this skill's local `tmp/` (gitignored):

```
.agents/skills/design/local-excalidraw/tmp/<descriptive-name>.excalidraw
```

## Default palette

Swap these hex values for your brand. Keep **roles** consistent across a post so diagrams read as a set.

| Role | Stroke | Fill | Use for |
|---|---|---|---|
| Subject / core concept | `#862e9c` | `#e5dbff` | The central thing being worked on |
| Environment / sandbox | `#1971c2` | `#d0ebff` | Containers, infrastructure, execution environments |
| Agent / worker | `#2f9e44` | `#d8f5a2` | Agents, harnesses, active workers |
| Data / files | `#868e96` | `#f1f3f5` | Persisted files, local data, passive storage |
| State / history | `#e8590c` | `#fff4e6` | Trajectories, reasoning history, state |
| Observability | `#5c940d` | `#e9fac8` | Tracing, monitoring |
| Failure / danger | `#e03131` | `#ffe3e3` | Failed states, warnings |
| Neutral text / arrows | `#495057` or `#868e96` | — | Labels, arrows, dividers |

## Rules

1. **Boxes with short titles only.** No bullet lists or paragraphs inside elements. A box is titled "Security" or "Sandbox". That is it.
2. **Box-in-box for containment.** A worker inside an environment is a green box inside a blue box. Outer box: small label, top-left. Inner box: centered title.
3. **Arrows show relationships.** One arrow, one direction. Label only if the relationship is not obvious.
4. **Tiny unlabeled boxes for scale.** To show "many," scatter 40×28 or 50×35 copies. Shape and color tell the story.
5. **White background.** `"viewBackgroundColor": "#ffffff"`.
6. **Roughness 0.** Clean lines, not hand-drawn.
7. **Stroke width 2** for main elements, **1** for tiny ones.
8. **Low opacity on containers.** Outer environment boxes use `"opacity": 40` so inner elements show through.
9. **At most 6–8 words per element.** Split if you need more.
10. **Read the source first.** Diagram relationships that are in the post or outline. Do not add concepts that are not there.

## JSON

Every element needs at minimum:

```json
{
  "id": "unique-id",
  "type": "rectangle",
  "x": 0, "y": 0,
  "width": 150, "height": 100,
  "angle": 0,
  "strokeColor": "#1971c2",
  "backgroundColor": "#d0ebff",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "roundness": { "type": 3 },
  "seed": 1234,
  "version": 1,
  "isDeleted": false,
  "boundElements": null,
  "locked": false
}
```

Text inside a box uses `"containerId"` pointing at the box id. The box gets `"boundElements": [{"id": "text-id", "type": "text"}]`.

Arrows use `"type": "arrow"` with `"points": [[0,0],[dx,dy]]`.

Wrap everything in:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "developer-content-skills",
  "elements": [],
  "appState": { "viewBackgroundColor": "#ffffff", "gridSize": null },
  "files": {}
}
```

## Related

| Need | Skill |
|---|---|
| Longform draft that needs a figure | [`../../content/write-blog/SKILL.md`](../../content/write-blog/SKILL.md) |
| Slide outline | [`../slide-maker-with-ai/SKILL.md`](../slide-maker-with-ai/SKILL.md) |
