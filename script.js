// ====== TUYẾT RƠI (Canvas) ======
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let w, h, dpr;
function resize() {
  dpr = Math.max(1, window.devicePixelRatio || 1);
  w = canvas.clientWidth = window.innerWidth;
  h = canvas.clientHeight = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function rand(min, max){ return Math.random() * (max - min) + min; }

const flakes = [];
const FLAKE_COUNT = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 9000));

for (let i = 0; i < FLAKE_COUNT; i++) {
  flakes.push({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.8, 3.2),
    vx: rand(-0.35, 0.35),
    vy: rand(0.9, 2.4),
    a: rand(0.35, 0.95),
  });
}

function drawSnow() {
  ctx.clearRect(0, 0, w, h);
  for (const f of flakes) {
    ctx.beginPath();
    ctx.globalAlpha = f.a;
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    f.x += f.vx;
    f.y += f.vy;

    if (f.y > h + 10) { f.y = -10; f.x = rand(0, w); }
    if (f.x > w + 10) f.x = -10;
    if (f.x < -10) f.x = w + 10;
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawSnow);
}
drawSnow();


// ====== NHẠC NỀN ======
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");
let musicOn = false;

async function tryPlayMusic() {
  try {
    bgm.volume = 0.6;
    await bgm.play();
    musicOn = true;
    musicBtn.textContent = "🔊 Tắt nhạc";
  } catch {
    musicOn = false;
    musicBtn.textContent = "🔈 Bật nhạc";
  }
}

musicBtn.addEventListener("click", async () => {
  if (!musicOn) await tryPlayMusic();
  else {
    bgm.pause();
    musicOn = false;
    musicBtn.textContent = "🔈 Bật nhạc";
  }
});

// thử autoplay khi load (có thể bị chặn)
window.addEventListener("load", () => {
  tryPlayMusic();
});


// ====== ALBUM ẢNH (BẤM HỘP QUÀ) ======
// Sửa đúng tên ảnh của bạn:
const galleryImages = [
  "assets/gallery/1.jpg",
  "assets/gallery/2.jpg",
  "assets/gallery/3.jpg",
  "assets/gallery/4.jpg",
];

const giftBtn = document.getElementById("giftBtn");
const modal = document.getElementById("modal");
const closeModalBtn = document.getElementById("closeModal");
const viewerImg = document.getElementById("viewerImg");
const thumbs = document.getElementById("thumbs");
const emptyNote = document.getElementById("emptyNote");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function buildThumbs() {
  thumbs.innerHTML = "";
  emptyNote.style.display = "none";

  if (!galleryImages || galleryImages.length === 0) {
    emptyNote.style.display = "block";
    return;
  }

  galleryImages.forEach((src, i) => {
    const t = document.createElement("button");
    t.className = "thumb";
    t.type = "button";
    t.addEventListener("click", () => showImage(i));

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Ảnh ${i + 1}`;

    img.addEventListener("error", () => {
      t.remove();
      if (thumbs.children.length === 0) emptyNote.style.display = "block";
    });

    t.appendChild(img);
    thumbs.appendChild(t);
  });

  if (thumbs.children.length === 0) emptyNote.style.display = "block";
}

function showImage(index) {
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  viewerImg.src = galleryImages[currentIndex];

  [...thumbs.children].forEach((el, i) => {
    el.classList.toggle("isActive", i === currentIndex);
  });
}

function openModal() {
  modal.classList.add("isOpen");
  modal.setAttribute("aria-hidden", "false");

  // nhấn quà là tương tác => phát nhạc nếu trước đó bị chặn
  if (!musicOn) tryPlayMusic();

  buildThumbs();
  showImage(0);
}

function closeModal() {
  modal.classList.remove("isOpen");
  modal.setAttribute("aria-hidden", "true");
}

giftBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

// bấm ra ngoài để đóng
modal.addEventListener("click", (e) => {
  const isBackdrop = e.target && e.target.dataset && e.target.dataset.close === "1";
  if (isBackdrop) closeModal();
});

// prev/next
prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

// phím tắt
window.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("isOpen")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});
