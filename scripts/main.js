// �������
async function loadComponent(componentName, containerId) {
    try {
        const response = await fetch(componentName);
        if (!response.ok) {
            throw new Error(`Failed to load ${componentName}: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
        
        // ��ʼ�������л�
        if (componentName === 'header.html') {
            initTheme();
        }
        
        // ��ʼ������������
        if (componentName === 'calculator.html') {
            initCalculator();
        }
    } catch (error) {
        console.error(error);
        document.getElementById(containerId).innerHTML = `<p>Error loading component: ${componentName}</p>`;
    }
}

// �����������
function loadAllComponents() {
    loadComponent('header.html', 'header-container');
    loadComponent('calculator.html', 'calculator-container');
    loadComponent('footer.html', 'footer-container');
}

// ҳ�������ɺ�ִ��
document.addEventListener('DOMContentLoaded', () => {
    loadAllComponents();
    
    // ����̨��ӭ��Ϣ
    console.log('%cWelcome to Scientific Calculator!', 
        'font-size: 18px; font-weight: bold; color: #2c5282;');
    console.log('%cClean design with advanced functionality', 
        'font-size: 14px; color: #4caf50;');
});