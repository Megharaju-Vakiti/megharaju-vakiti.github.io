(() => {
  const frame = document.querySelector(".contact-frame");
  const art = document.querySelector(".contact-frame-art");
  if (!frame || !art) return;

  const NS = "http://www.w3.org/2000/svg";
  const border = { band: 30, zig: 26, stroke: 4 };
  const hash = (n) => {
    const value = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const jitter = (n, amount) => (hash(n) - 0.5) * 2 * amount;
  const pointString = (point) => `${point[0].toFixed(1)} ${point[1].toFixed(1)}`;

  const side = (start, end, seed) => {
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const count = Math.max(1, Math.round(length / 70));
    const normal = [-(end[1] - start[1]) / length, (end[0] - start[0]) / length];
    return Array.from({ length: count }, (_, index) => {
      const t = index / count;
      const offset = index === 0 ? 0 : jitter(seed + index, 1.1);
      return [
        start[0] + (end[0] - start[0]) * t + normal[0] * offset,
        start[1] + (end[1] - start[1]) * t + normal[1] * offset
      ];
    });
  };

  const zigzag = (start, end, normal, seed) => {
    const length = Math.hypot(end[0] - start[0], end[1] - start[1]);
    const count = Math.max(2, 2 * Math.round(length / border.zig / 2));
    const points = Array.from({ length: count + 1 }, (_, index) => {
      const t = index / count;
      const offset = (index % 2 ? border.band : 0) + jitter(seed + index, 0.9);
      return [
        start[0] + (end[0] - start[0]) * t + normal[0] * offset,
        start[1] + (end[1] - start[1]) * t + normal[1] * offset + jitter(seed + index + 99, 0.6)
      ];
    });
    return `M${points.map(pointString).join("L")}`;
  };

  const closedPath = (points) => `M${points.map(pointString).join("L")}Z`;
  const draw = () => {
    const width = frame.clientWidth;
    const height = frame.clientHeight;
    if (!width || !height) return;

    const inset = border.stroke / 2 + 2;
    const innerInset = inset + border.band;
    const outerCorners = [[inset, inset], [width - inset, inset], [width - inset, height - inset], [inset, height - inset]];
    const innerCorners = [[innerInset, innerInset], [width - innerInset, innerInset], [width - innerInset, height - innerInset], [innerInset, height - innerInset]];
    const outer = outerCorners.flatMap((point, index) => side(point, outerCorners[(index + 1) % 4], index + 1));
    const inner = innerCorners.flatMap((point, index) => side(point, innerCorners[(index + 1) % 4], index + 5));
    const [a, b, c, d] = outerCorners;
    const zigzags = [
      zigzag(a, b, [0, 1], 10),
      zigzag(b, c, [-1, 0], 20),
      zigzag(c, d, [0, -1], 30),
      zigzag(d, a, [1, 0], 40)
    ];

    art.setAttribute("viewBox", `0 0 ${width} ${height}`);
    art.replaceChildren();
    [closedPath(outer), closedPath(inner), ...zigzags].forEach((pathData) => {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", pathData);
      path.setAttribute("stroke-width", String(border.stroke));
      art.append(path);
    });
  };

  const observer = new ResizeObserver(draw);
  observer.observe(frame);
  window.addEventListener("orientationchange", draw);
  draw();
})();
