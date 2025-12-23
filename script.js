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

const flakes = [];
const FLAKE_COUNT = 160;

function rand(min, max){ return Math.random() * (max - min) + min; }

for (let i = 0; i < FLAKE_COUNT; i++) {
  flakes.push({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.8, 3.2),
    vx: rand(-0.4, 0.4),
    vy: rand(0.8, 2.2),
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

    if (f.y > h + 10) {
      f.y = -10;
      f.x = rand(0, w);
    }
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

// Trình duyệt thường CHẶN autoplay có tiếng.
// Ta sẽ thử play, nếu fail thì yêu cầu người dùng bấm nút.
async function tryPlayMusic() {
  try {
    await bgm.play();
    musicOn = true;
    musicBtn.textContent = "🔊 Tắt nhạc";
  } catch (e) {
    musicOn = false;
    musicBtn.textContent = "🔈 Bật nhạc";
  }
}

musicBtn.addEventListener("click", async () => {
  if (!musicOn) {
    await tryPlayMusic();
  } else {
    bgm.pause();
    musicOn = false;
    musicBtn.textContent = "🔈 Bật nhạc";
  }
});

// Tự thử phát nhạc khi load trang
window.addEventListener("load", () => {
  tryPlayMusic();
});


// ====== ALBUM ẢNH (BẤM HỘP QUÀ) ======
// Bạn thay danh sách này bằng ảnh bạn muốn hiển thị:
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

function openModal() {
  modal.classList.add("isOpen");
  modal.setAttribute("aria-hidden", "false");

  // nếu nhạc chưa bật, bấm quà cũng là 1 tương tác => có thể phát nhạc
  if (!musicOn) tryPlayMusic();

  buildThumbs();
  showImage(0);
}

function closeModal() {
  modal.classList.remove("isOpen");
  modal.setAttribute("aria-hidden", "true");
}

function showImage(index) {
  currentIndex = (index + galleryImages.length) % galleryImages.length;
  viewerImg.src = galleryImages[currentIndex];

  [...thumbs.children].forEach((el, i) => {
    el.classList.toggle("isActive", i === currentIndex);
  });
}

function buildThumbs() {
  thumbs.innerHTML = "";

  if (!galleryImages || galleryImages.length === 0) {
    emptyNote.style.display = "block";
    return;
  }
  emptyNote.style.display = "none";

  galleryImages.forEach((src, i) => {
    const t = document.createElement("button");
    t.className = "thumb";
    t.type = "button";
    t.addEventListener("click", () => showImage(i));

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Ảnh ${i + 1}`;

    // nếu ảnh lỗi (chưa upload), ẩn thumbnail đó để khỏi rối
    img.addEventListener("error", () => {
      t.remove();
      if (thumbs.children.length === 0) emptyNote.style.display = "block";
    });

    t.appendChild(img);
    thumbs.appendChild(t);
  });
}

giftBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);

// bấm ra ngoài để đóng
modal.addEventListener("click", (e) => {
  const isBackdrop = e.target && e.target.dataset && e.target.dataset.close === "1";
  if (isBackdrop) closeModal();
});

// nút prev/next
prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

// phím tắt
window.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("isOpen")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") showImage(currentIndex - 1);
  if (e.key === "ArrowRight") showImage(currentIndex + 1);
});
