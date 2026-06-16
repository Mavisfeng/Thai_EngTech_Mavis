/* ==========================================================================
   EngTech 數位遊牧網站前端控制邏輯 (script.js)
   用意：控制手機版漢堡選單的彈出、表單驗證、與無重新整理的資料攔截提交
   修改範圍：可自行擴充 API 送出位置、或調整表單提交後的成功彈出字樣
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. 手機版行動選單開合控制 (RWD Mobile Hamburger Menu)
    // ==========================================
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function() {
            // 切換 active class 控制選單的顯隱 (參閱 style.css 行動裝置斷點)
            navMenu.classList.toggle("active");
            
            // 漢堡選單轉變為克漏字動態視覺反饋
            menuToggle.classList.toggle("open");
        });
    }

    // 點擊導覽連結後，自動將選單縮回 (優化使用者體驗)
    const links = document.querySelectorAll(".nav-link, .nav-btn");
    links.forEach(link => {
        link.addEventListener("click", function() {
            if (navMenu && navMenu.classList.contains("active")) {
                navMenu.classList.remove("active");
            }
            
            // 移除選單項目的作用中狀態並設定當前點擊為 active
            if(this.classList.contains("nav-link")) {
                links.forEach(item => item.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });


    // ==========================================
    // 2. 線上報名表單攔截與資料防呆系統 (Form Validation)
    // 規格要求：嚴格驗證聯絡人姓名、聯絡電話、Email 欄位
    // ==========================================
    const registerForm = document.getElementById("nomadRegisterForm");
    const submissionMessage = document.getElementById("submissionMessage");

    if (registerForm) {
        registerForm.addEventListener("submit", function(event) {
            // 阻止表單預設的網頁跳轉刷新行為，以便進行非同步處理與部署在 GitHub Pages
            event.preventDefault();

            // 讀取並清除欄位字串前後空格
            const clientName = document.getElementById("userName").value.trim();
            const clientPhone = document.getElementById("userPhone").value.trim();
            const clientEmail = document.getElementById("userEmail").value.trim();
            const chosenCourse = document.getElementById("selectPlan").options[document.getElementById("selectPlan").selectedIndex].text;

            // 基礎資料安全前置防呆
            if (!clientName || !clientPhone || !clientEmail) {
                renderFormFeedback("請填寫所有標註有紅色星號 (*) 的必填欄位。", "error");
                return;
            }

            // 聯絡電話格式簡易長度過濾 (確保不低於 8 碼)
            if (clientPhone.length < 8) {
                renderFormFeedback("請輸入格式正確的聯絡電話 (手機或市話)。", "error");
                return;
            }

            // 包裝本筆數位遊牧行程報名學員資料
            const payload = {
                timestamp: new Date().toISOString(),
                contactName: clientName,
                contactPhone: clientPhone,
                contactEmail: clientEmail,
                courseInterest: chosenCourse
            };

            // 在主控台進行 Log 追蹤，未來您可以直接將 payload 利用 fetch() 串接外部後端、Google Sheets 或 Email 發送服務
            console.log("=== EngTech 已成功擷取一筆線上報名資訊 ===");
            console.log(payload);

            // 渲染成功動態通知
            renderFormFeedback(`🎉 謝謝您，${clientName}！您的線上預約資料已成功登記。課程顧問將於 24 小時內寄送諮詢簡章至 ${clientEmail}，請密切留意！`, "success");

            // 清空表單內容
            registerForm.reset();
        });
    }

    // 渲染反饋訊息的封裝函式
    function renderFormFeedback(text, status) {
        if (!submissionMessage) return;
        
        submissionMessage.innerText = text;
        submissionMessage.className = "alert-box"; // 還原基本樣式
        
        if (status === "success") {
            submissionMessage.classList.add("success");
        } else if (status === "error") {
            submissionMessage.classList.add("error");
        }
        
        // 顯示訊息元件
        submissionMessage.classList.remove("hidden");
        
        // 自動平滑滾動到提示框位置
        submissionMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});