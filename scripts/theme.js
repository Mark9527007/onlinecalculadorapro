function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const topNav = document.querySelector('.top-nav');
    
    // 主题管理
    function setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('calculatorTheme', 'dark');
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('calculatorTheme', 'light');
        }
    }
    
    // 初始化主题
    const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
    setTheme(savedTheme);
    
    // 切换主题
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('dark-theme')) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        });
    }
    
    // 导航滚动效果
    if (topNav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                topNav.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.2)';
                topNav.style.height = '60px';
            } else {
                topNav.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                topNav.style.height = '70px';
            }
        });
    }
}