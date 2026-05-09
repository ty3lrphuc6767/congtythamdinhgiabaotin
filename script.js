// ====================== BẢO TÍN WEBSITE FUNCTIONS ======================

document.addEventListener("DOMContentLoaded", function () {
  initStickyHeader();
  initMobileMenu();
  initTabs();
  initNewsSystem();
  initContactForm();
});

// ====================== HEADER SCROLL EFFECT ======================
function initStickyHeader() {
  const header = document.querySelector(".header");

  if (!header) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  });
}

// ====================== MOBILE MENU ======================
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav__link");

  if (!hamburger || !nav) return;

  hamburger.addEventListener("click", function () {
    nav.classList.toggle("nav--open");
    hamburger.classList.toggle("hamburger--active");

    const isOpen = nav.classList.contains("nav--open");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("nav--open");
      hamburger.classList.remove("hamburger--active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ====================== SERVICE TABS ======================
function initTabs() {
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");
  const tabOpenLinks = document.querySelectorAll("[data-open-tab]");

  if (!tabs.length || !tabContents.length) return;

  function openTab(tabName, shouldScroll) {
    const targetTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
    const targetContent = document.getElementById("tab-" + tabName);

    if (!targetTab || !targetContent) return;

    tabs.forEach(function (item) {
      item.classList.remove("tab--active");
    });

    tabContents.forEach(function (content) {
      content.classList.remove("tab-content--active");
    });

    targetTab.classList.add("tab--active");
    targetContent.classList.add("tab-content--active");

    const targetPane = targetContent.querySelector(".tab-pane");

    if (targetPane) {
      targetPane.classList.remove("tab-pane--focus");
      void targetPane.offsetWidth;
      targetPane.classList.add("tab-pane--focus");
    }

    if (shouldScroll && targetPane) {
      setTimeout(function () {
        targetPane.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 150);
    }
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const tabName = tab.getAttribute("data-tab");
      openTab(tabName, false);
    });
  });

  tabOpenLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const tabName = link.getAttribute("data-open-tab");
      openTab(tabName, true);

      const nav = document.getElementById("nav");
      const hamburger = document.getElementById("hamburger");

      if (nav) nav.classList.remove("nav--open");

      if (hamburger) {
        hamburger.classList.remove("hamburger--active");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });
}
// ====================== NEWS ADMIN SYSTEM ======================

function initNewsSystem() {
  const ADMIN_SECRET_CODE = "BAOTIN2026";
  const ADMIN_PASSWORD = "123456";

  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const adminModal = document.getElementById("adminModal");
  const postModal = document.getElementById("postModal");

  const adminRegisterForm = document.getElementById("adminRegisterForm");
  const postArticleForm = document.getElementById("postArticleForm");

  const postArticleBtn = document.getElementById("postArticleBtn");
  const logoutAdminBtn = document.getElementById("logoutAdminBtn");
  const newsList = document.getElementById("newsList");

  if (!newsList) return;

  const defaultNews = [
    {
      id: 1,
      title: "Dịch vụ thẩm định giá bất động sản chuyên nghiệp",
      url: "#",
      desc: "Thông tin tổng quan về dịch vụ thẩm định giá bất động sản cho cá nhân, doanh nghiệp và tổ chức tín dụng.",
      date: "2026-01-01"
    },
    {
      id: 2,
      title: "Thẩm định giá máy móc thiết bị và tài sản doanh nghiệp",
      url: "#",
      desc: "Giải pháp xác định giá trị máy móc, dây chuyền sản xuất, phương tiện vận tải và tài sản cố định.",
      date: "2026-01-02"
    }
  ];

  function getAdminStatus() {
    return localStorage.getItem("btva_is_admin") === "true";
  }

  function setAdminStatus(value) {
    localStorage.setItem("btva_is_admin", value ? "true" : "false");
  }

  function getNewsPosts() {
    const savedPosts = localStorage.getItem("btva_news_posts");

    if (!savedPosts) {
      localStorage.setItem("btva_news_posts", JSON.stringify(defaultNews));
      return defaultNews;
    }

    try {
      return JSON.parse(savedPosts);
    } catch (error) {
      localStorage.setItem("btva_news_posts", JSON.stringify(defaultNews));
      return defaultNews;
    }
  }

  function saveNewsPosts(posts) {
    localStorage.setItem("btva_news_posts", JSON.stringify(posts));
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("modal--open");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("modal--open");
  }

  function updateAdminUI() {
    const isAdmin = getAdminStatus();
    const adminOnlyElements = document.querySelectorAll(".admin-only");

    adminOnlyElements.forEach(function (element) {
      element.style.display = isAdmin ? "inline-flex" : "none";
    });

    if (adminLoginBtn) {
      adminLoginBtn.style.display = isAdmin ? "none" : "block";
    }

    renderNewsList();
  }

  function renderNewsList() {
    const posts = getNewsPosts();
    const isAdmin = getAdminStatus();

    if (!posts.length) {
      newsList.innerHTML = `
        <div class="empty-news">
          Chưa có bài viết nào. Quản trị viên có thể đăng bài mới.
        </div>
      `;
      return;
    }

    newsList.innerHTML = posts
      .map(function (post) {
        return `
          <article class="news-card">
            <div class="news-card__content">
              <span class="news-card__date">${post.date || ""}</span>
              <h3>${escapeHTML(post.title)}</h3>
              <p>${escapeHTML(post.desc || "")}</p>

              <div class="news-card__actions">
                <a href="${escapeAttribute(post.url)}" target="_blank" rel="noopener noreferrer" class="news-link">
                  Xem bài viết
                </a>

                ${
                  isAdmin
                    ? `<button class="delete-news-btn" data-id="${post.id}">Xóa bài</button>`
                    : ""
                }
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  function escapeHTML(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttribute(text) {
    return String(text).replaceAll('"', "%22").replaceAll("'", "%27");
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", function () {
      openModal(adminModal);
    });
  }

  if (postArticleBtn) {
    postArticleBtn.addEventListener("click", function () {
      openModal(postModal);
    });
  }

  if (logoutAdminBtn) {
    logoutAdminBtn.addEventListener("click", function () {
      const confirmLogout = confirm("Anh có chắc muốn đăng xuất quản trị không?");

      if (!confirmLogout) return;

      setAdminStatus(false);
      updateAdminUI();
    });
  }

  document.querySelectorAll(".modal__close").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const modalId = btn.getAttribute("data-close");
      const modal = document.getElementById(modalId);
      closeModal(modal);
    });
  });

  document.querySelectorAll(".modal").forEach(function (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  if (adminRegisterForm) {
    adminRegisterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("adminName").value.trim();
      const email = document.getElementById("adminEmail").value.trim();
      const password = document.getElementById("adminPassword").value.trim();
      const adminCode = document.getElementById("adminCode").value.trim();

      if (!name || !email || !password || !adminCode) {
        alert("Anh nhập đủ thông tin quản trị giúp em.");
        return;
      }

      if (adminCode !== ADMIN_SECRET_CODE) {
        alert("Mã quản trị viên không đúng.");
        return;
      }

      if (password.length < 6) {
        alert("Mật khẩu nên có ít nhất 6 ký tự.");
        return;
      }

      const adminInfo = {
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("btva_admin_info", JSON.stringify(adminInfo));
      setAdminStatus(true);

      adminRegisterForm.reset();
      closeModal(adminModal);
      updateAdminUI();

      alert("Đăng nhập quản trị thành công. Anh có thể đăng bài ở mục Tin tức.");
    });
  }

  if (postArticleForm) {
    postArticleForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!getAdminStatus()) {
        alert("Anh cần đăng nhập quản trị viên trước.");
        return;
      }

      const title = document.getElementById("postTitle").value.trim();
      const url = document.getElementById("postUrl").value.trim();
      const desc = document.getElementById("postDesc").value.trim();

      if (!title || !url) {
        alert("Tiêu đề và link bài viết là bắt buộc.");
        return;
      }

      const posts = getNewsPosts();

      const newPost = {
        id: Date.now(),
        title: title,
        url: url,
        desc: desc,
        date: new Date().toLocaleDateString("vi-VN")
      };

      posts.unshift(newPost);
      saveNewsPosts(posts);

      postArticleForm.reset();
      closeModal(postModal);
      renderNewsList();

      alert("Đã đăng bài thành công.");
    });
  }

  newsList.addEventListener("click", function (event) {
    const deleteBtn = event.target.closest(".delete-news-btn");

    if (!deleteBtn) return;

    if (!getAdminStatus()) {
      alert("Anh cần đăng nhập quản trị viên trước.");
      return;
    }

    const postId = Number(deleteBtn.getAttribute("data-id"));
    const confirmDelete = confirm("Anh có chắc muốn xóa bài này không?");

    if (!confirmDelete) return;

    const posts = getNewsPosts().filter(function (post) {
      return Number(post.id) !== postId;
    });

    saveNewsPosts(posts);
    renderNewsList();
  });

  updateAdminUI();
}
// ====================== CONTACT FORM ======================

function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const service = document.getElementById("contactService").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !phone || !service || !message) {
      alert("Anh/chị vui lòng nhập đầy đủ họ tên, số điện thoại, nhu cầu và nội dung tư vấn.");
      return;
    }

    const companyEmail = "Thamdinhgiabaotindn@gmail.com";
    const subject = encodeURIComponent("Yêu cầu tư vấn thẩm định giá từ website");

    const body = encodeURIComponent(
      `Họ và tên: ${name}\n` +
      `Số điện thoại: ${phone}\n` +
      `Email: ${email || "Không cung cấp"}\n` +
      `Nhu cầu: ${service}\n\n` +
      `Nội dung:\n${message}`
    );

    window.location.href = `mailto:${companyEmail}?subject=${subject}&body=${body}`;
  });
}
