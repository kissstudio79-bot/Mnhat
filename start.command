#!/bin/bash
# Bấm đúp để chạy trên macOS (hoặc chạy: bash start.command)
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  [!] Chưa cài Node.js. Tải bản LTS tại: https://nodejs.org"
  echo ""
  read -n 1 -s -r -p "Nhấn phím bất kỳ để đóng..."
  exit 1
fi

echo ""
echo "  ============================================================"
echo "    BẢNG ĐIỂM BÓNG RỔ đang chạy!"
echo "    - Bảng điểm (thêm vào vMix/OBS): http://localhost:8000/scoreboard"
echo "    - Bảng điều khiển (bấm điểm)   : http://localhost:8000/control"
echo ""
echo "    GIỮ CỬA SỔ NÀY MỞ trong suốt buổi live."
echo "  ============================================================"
echo ""

node server.js
