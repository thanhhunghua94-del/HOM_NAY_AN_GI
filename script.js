const COLORS = ['#d6342b', '#f2b134', '#2f8f4e', '#ef7b9a', '#3a86c8', '#f08a24'];
const DEFAULTS = ['Bún bò','Mì Quảng','Tây đô','Phở','Bún riêu','Cơm sườn','Mì xào hải sản','Mì xào bò'];
 
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin');
const resultEl = document.getElementById('result');
const textarea = document.getElementById('items');
 
let items = [...DEFAULTS];
let rotation = 0;     // góc hiện tại của vòng quay (radian)
let spinning = false;
 
// Hiển thị danh sách mặc định và cập nhật khi người dùng sửa
textarea.value = items.join('\n');
textarea.addEventListener('input', () => {
  const list = textarea.value.split('\n').map(s => s.trim()).filter(Boolean);
  if (list.length >= 2) items = list;   // cần ít nhất 2 món
  draw();
});
 
// Vẽ vòng quay
function draw() {
  const size = canvas.width;
  const c = size / 2;
  const r = c - 6;
  const arc = (Math.PI * 2) / items.length;
 
  ctx.clearRect(0, 0, size, size);
 
  items.forEach((name, i) => {
    const start = rotation + i * arc;
 
    // Tô màu từng ô
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, start, start + arc);
    ctx.closePath();
    ctx.fillStyle = COLORS[i % COLORS.length];
    ctx.fill();
    ctx.strokeStyle = '#2b1d14';
    ctx.lineWidth = 4;
    ctx.stroke();
 
    // Ghi tên món, chữ nằm dọc theo bán kính
    ctx.save();
    ctx.translate(c, c);
    ctx.rotate(start + arc / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = `800 ${Math.max(22, 44 - items.length * 2)}px "Be Vietnam Pro", sans-serif`;
    const label = name.length > 14 ? name.slice(0, 13) + '…' : name;
    ctx.fillText(label, r - 24, 0);
    ctx.restore();
  });
}
 
// Quay vòng quay
function spin() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  resultEl.textContent = '';
 
  const TAU = Math.PI * 2;
  const arc = TAU / items.length;
 
  // 1. Chọn trước món trúng
  const winner = Math.floor(Math.random() * items.length);
  const offset = 0.15 + Math.random() * 0.7;              // dừng ở vị trí ngẫu nhiên trong ô
  const target = -Math.PI / 2 - (winner + offset) * arc;  // kim nằm ở đỉnh (-90°)
 
  // 2. Tính góc cần quay, cộng thêm 5 vòng cho đẹp
  const delta = (((target - rotation) % TAU) + TAU) % TAU + TAU * 5;
  const from = rotation;
  const duration = 4500;
  const t0 = performance.now();
 
  // 3. Hoạt ảnh
  function frame(now) {
    const t = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);                  // nhanh rồi chậm dần
    rotation = from + delta * ease;
    draw();
 
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      spinning = false;
      spinBtn.disabled = false;
      resultEl.textContent = ' ' + items[winner];
    }
  }
  requestAnimationFrame(frame);
}
 
spinBtn.addEventListener('click', spin);
document.fonts.ready.then(draw);
draw();