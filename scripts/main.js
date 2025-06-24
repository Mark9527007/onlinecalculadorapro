// 加载组件
async function loadComponent(componentName, containerId) {
    try {
        const response = await fetch(componentName);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentName}: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
        
        // 初始化主题切换
        if (componentName === 'header.html') {
            initTheme();
        }
        
        // 初始化计算器功能
        if (componentName === 'calculator.html') {
            initCalculator();
        }
    } catch (error) {
        console.error(error);
        document.getElementById(containerId).innerHTML = `<p>Error loading component: ${componentName}</p>`;
    }
}

// 加载所有组件
function loadAllComponents() {
    loadComponent('header.html', 'header-container');
    loadComponent('calculator.html', 'calculator-container');
    loadComponent('footer.html', 'footer-container');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    loadAllComponents();
    
    // 控制台欢迎信息
    console.log('%cWelcome to Scientific Calculator!', 
        'font-size: 18px; font-weight: bold; color: #2c5282;');
    console.log('%cClean design with advanced functionality', 
        'font-size: 14px; color: #4caf50;');
});