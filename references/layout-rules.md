# Layout rules

Use the `layout` fractions in `config/style-profile.json`; do not scatter vertical coordinates. Keep text inside left 72px, right 160px, top 100px and bottom 80px safe space. Cover the theme image without stretching it. Keep the active transcript sentence near the transcript region center and transition its color over 120–250ms.

Center the title block inside `layout.title` rather than pinning it to the region top. When the title region is moved, raise `layout.transcript[0]` only enough to preserve a clear gap below the title. A persistent left-side narrator may be configured through `style-profile.json.narrator`; it is a transparent PNG asset animated exclusively from the current Remotion frame.
