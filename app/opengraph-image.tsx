import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// twitter:card 声明的是 summary_large_image，没有图的话分享出去是张空卡片。
// 用 ImageResponse 在构建时生成，不必维护一张位图资产。
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — ${site.tagline}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 50% 38%, #16306b 0%, #0a1740 38%, #050c26 68%, #030614 100%)",
          color: "#f4f7ff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            letterSpacing: 4,
            color: "#8ea6dd",
          }}
        >
          <span>AXIN INTERNATIONAL GROUP</span>
          <span>TECHNOLOGY · CAPITAL · GLOBAL SERVICES</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 210,
              fontWeight: 900,
              letterSpacing: -14,
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            AXIN
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 44,
              lineHeight: 1.15,
              maxWidth: 900,
              color: "#dfe8ff",
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#7f97cf", letterSpacing: 2 }}>
          axingroup.com
        </div>
      </div>
    ),
    size,
  );
}
