import React, { useEffect, useRef } from 'react';

export const UniversityGlobe3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 320);
    let height = (canvas.height = 240);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 240;
    };
    window.addEventListener('resize', handleResize);

    const nodes = [
      { name: 'CSE', angle: 0, distance: 90, color: '#3B82F6', icon: '💻' },
      { name: 'ECE', angle: (Math.PI * 2) / 6, distance: 90, color: '#2563EB', icon: '⚡' },
      { name: '2022 Scheme', angle: (Math.PI * 4) / 6, distance: 90, color: '#059669', icon: '📜' },
      { name: 'SEE Exams', angle: (Math.PI * 6) / 6, distance: 90, color: '#D97706', icon: '📝' },
      { name: 'SVIT', angle: (Math.PI * 8) / 6, distance: 90, color: '#9333EA', icon: '🏛️' },
      { name: 'RVCE', angle: (Math.PI * 10) / 6, distance: 90, color: '#0284C7', icon: '🎓' },
    ];

    let rotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Orbit Path
      ctx.beginPath();
      ctx.arc(centerX, centerY, 90, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.15)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Central University Crest Glow & Circle
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 55);
      gradient.addColorStop(0, '#1E3A8A');
      gradient.addColorStop(0.7, '#1D4ED8');
      gradient.addColorStop(1, '#2563EB');

      ctx.save();
      ctx.shadowColor = 'rgba(37, 99, 235, 0.4)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 42, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // VTU Text inside core
      ctx.font = '800 16px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VTU', centerX, centerY - 4);

      ctx.font = '600 9px Plus Jakarta Sans, sans-serif';
      ctx.fillStyle = '#93C5FD';
      ctx.fillText('BELAGAVI', centerX, centerY + 12);

      // Draw Rotating Nodes & Connecting Beams
      rotation += 0.008;

      nodes.forEach((node) => {
        const currentAngle = node.angle + rotation;
        const x = centerX + Math.cos(currentAngle) * node.distance;
        const y = centerY + Math.sin(currentAngle) * (node.distance * 0.55); // Elliptical 3D tilt

        // Beam lines
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Node Circle
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Node Emoji/Icon
        ctx.font = '12px sans-serif';
        ctx.fillText(node.icon, x, y);

        // Label pill
        ctx.font = '700 10px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(node.name, x, y + 24);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[240px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950/5 via-slate-900/5 to-indigo-950/10 dark:from-blue-950/40 dark:to-slate-900/40 border border-border">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
