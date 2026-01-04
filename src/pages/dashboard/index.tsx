import React, { useRef, useState, useMemo } from "react";

const prizes = ["乐花", "周某某", "伯琳", "小吴", "俊嘉"];

const colors = [
  "#fde047", // 黄
  "#86efac", // 绿
  "#93c5fd", // 蓝
  "#f9a8d4", // 粉
  "#fdba74", // 橙
];

const DURATION = 5000; // ⏱ 5 秒

const Dashboard: React.FC = () => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [rotating, setRotating] = useState(false);

  const count = prizes.length;
  const angle = 360 / count;

  // 🎨 生成等分 5 色背景
  const wheelBg = useMemo(() => {
    const stops: string[] = [];
    for (let i = 0; i < count; i++) {
      const start = angle * i;
      const end = angle * (i + 1);
      const color = colors[i % colors.length];
      stops.push(`${color} ${start}deg ${end}deg`);
    }
    return `conic-gradient(${stops.join(",")})`;
  }, [count, angle]);

  const startLottery = () => {
    if (rotating || !wheelRef.current) return;

    const index = Math.floor(Math.random() * count);
    const rotateDeg = 360 * 6 + (360 - index * angle - angle / 2); // 多转几圈更爽

    const wheel = wheelRef.current;
    setRotating(true);

    // ① 重置
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";
    wheel.offsetHeight; // 强制重排

    // ② 5 秒快速转
    wheel.style.transition = `transform ${DURATION}ms cubic-bezier(0.05, 0.9, 0.2, 1)`;
    wheel.style.transform = `rotate(${rotateDeg}deg)`;

    setTimeout(() => {
      alert(`🎉 恭喜你抽中：${prizes[index]}`);
      setRotating(false);
    }, DURATION);
  };

  return (
    <>
      <div className="lottery-container">
        <h1>🎁 疯狂星期四 幸运大转盘（公平 公正 公开）</h1>
        <h2>🎁 中奖者获得16.8RMB以内 一杯</h2>

        <div className="wheel-wrapper">
          <div className="pointer">▼</div>

          <div
            className="wheel"
            ref={wheelRef}
            style={{ background: wheelBg }}
          >
            {prizes.map((item, index) => (
              <div
                key={index}
                className="label"
                style={{
                  transform: `rotate(${angle * index + angle / 2}deg)`,
                }}
              >
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="start-btn"
          onClick={startLottery}
          disabled={rotating}
        >
          {rotating ? "抽奖中..." : "开始抽奖"}
        </button>
      </div>

      {/* ===== CSS（页面内） ===== */}
      <style>
        {`
        .lottery-container {
          text-align: center;
          padding: 40px;
        }

        .wheel-wrapper {
          position: relative;
          width: 300px;
          height: 300px;
          margin: 30px auto;
        }

        .wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 6px solid #f59e0b;
          position: relative;
        }

        .label {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          pointer-events: none;
        }

        .label span {
          margin-top: 18px;
          font-size: 14px;
          font-weight: bold;
          white-space: nowrap;
        }

        .pointer {
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 24px;
          color: red;
          z-index: 10;
        }

        .start-btn {
          margin-top: 20px;
          padding: 10px 24px;
          font-size: 16px;
          background: #f59e0b;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .start-btn:disabled {
          background: #e5e7eb;
          cursor: not-allowed;
        }

        .start-btn:hover:not(:disabled) {
          background: #d97706;
        }
        `}
      </style>
    </>
  );
};

export default Dashboard;
