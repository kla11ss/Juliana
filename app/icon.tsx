import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #07111f 0%, #12315d 55%, #611627 100%)",
          borderRadius: 16,
          color: "#f6f8ff",
          display: "flex",
          fontSize: 30,
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          width: "100%"
        }}
      >
        UG
      </div>
    ),
    size
  );
}
