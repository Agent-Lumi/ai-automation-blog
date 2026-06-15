/**
 * Post Enhancements for AI Automation Weekly
 * Adds Table of Contents, Reading Time, Copy Code, and Related Articles
 * Made by Lumi 💡
 */

(function() {
    'use strict';
    
    // Initialize enhancements when DOM is ready
    document.addEventListener('DOMContentLoaded', initEnhancements);
    
    function initEnhancements() {
        addReadingTime();
        addTableOfContents();
        addCopyCodeButtons();
        addBackToTop();
        addProgressBar();
        highlightCurrentSection();
    }
    
    // =====================
    // Reading Time Calculator
    // =====================
    function addReadingTime() {
        const content = document.querySelector('.article-content, .post-content');
        if (!content) return;
        
        const text = content.innerText || content.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Average 200 WPM
        
        // Add to meta section
        const metaSection = document.querySelector('.article-meta-header, .post-meta');
        if (metaSection) {
            const timeEl = document.createElement('span');
            timeEl.className = 'reading-time';
            timeEl.innerHTML = `⏱️ ${readingTime} min read`;
            timeEl.style.cssText = 'margin-left: 15px; opacity: 0.8; font-size: 0.9em;';
            metaSection.appendChild(timeEl);
        }
        
        // Also add word count tooltip
        const wordCountEl = document.createElement('div');
        wordCountEl.className = 'word-count';
        wordCountEl.innerHTML = `${wordCount.toLocaleString()} words`;
        wordCountEl.style.cssText = 'font-size: 0.8em; opacity: 0.6; margin-top: 5px;';
        
        const timeContainer = document.querySelector('.reading-time');
        if (timeContainer) {
            timeContainer.title = `${wordCount.toLocaleString()} words`;
        }
    }
    
    // =====================
    // Table of Contents
    // =====================
    function addTableOfContents() {
        const content = document.querySelector('.article-content, .post-content');
        if (!content) return;
        
        const headings = content.querySelectorAll('h2, h3');
        if (headings.length < 3) return; // Only add TOC if enough headings
        
        // Create TOC container
        const toc = document.createElement('nav');
        toc.className = 'table-of-contents';
        toc.innerHTML = '<h4>📑 Table of Contents</h4>';
        
        const tocList = document.createElement('ul');
        
        headings.forEach((heading, index) => {
            // Add ID to heading if not present
            if (!heading.id) {
                heading.id = `section-${index}`;
            }
            
            const level = heading.tagName === 'H2' ? 0 : 1;
            const listItem = document.createElement('li');
            listItem.style.paddingLeft = level === 1 ? '15px' : '0';
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent;
            link.className = 'toc-link';
            link.dataset.target = heading.id;
            
            // Smooth scroll on click
            link.addEventListener('click', (e) => {
                e.preventDefault();
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, `#${heading.id}`);
            });
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        });
        
        toc.appendChild(tocList);
        
        // Insert TOC before content
        content.insertBefore(toc, content.firstChild);
        
        // Add TOC styles
        const styles = document.createElement('style');
        styles.textContent = `
            .table-of-contents {
                background: linear-gradient(135deg, #f8fafc, #e2e8f0);
                border: 1px solid var(--border, #e5e7eb);
                border-radius: 12px;
                padding: 20px 25px;
                margin-bottom: 30px;
            }
            .table-of-contents h4 {
                margin: 0 0 15px 0;
                font-size: 1.1em;
                color: var(--text, #1f2937);
            }
            .table-of-contents ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .table-of-contents li {
                margin: 8px 0;
            }
            .table-of-contents a {
                color: var(--text-light, #6b7280);
                text-decoration: none;
                font-size: 0.95em;
                transition: color 0.2s, padding-left 0.2s;
                display: inline-block;
            }
            .table-of-contents a:hover {
                color: var(--primary, #2563eb);
                padding-left: 5px;
            }
            .table-of-contents a.active {
                color: var(--primary, #2563eb);
                font-weight: 600;
            }
            .toc-indicator {
                display: inline-block;
                width: 0;
                height: 0;
                border-left: 4px solid var(--primary, #2563eb);
                border-top: 4px solid transparent;
                border-bottom: 4px solid transparent;
                margin-right: 8px;
                opacity: 0;
                transition: opacity 0.2s;
            }
            .table-of-contents a.active .toc-indicator {
                opacity: 1;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // =====================
    // Copy Code Buttons
    // =====================
    function addCopyCodeButtons() {
        const codeBlocks = document.querySelectorAll('pre code, .code-block');
        
        codeBlocks.forEach((codeBlock) => {
            const pre = codeBlock.parentElement;
            if (!pre || pre.tagName !== 'PRE') return;
            
            // Wrap in container
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            wrapper.style.cssText = 'position: relative; margin: 20px 0;';
            
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            
            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-code-btn';
            copyBtn.innerHTML = '📋 Copy';
            copyBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255,255,255,0.9);
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 6px 12px;
                font-size: 0.85em;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s, background 0.2s;
                color: #333;
            `;
            
            wrapper.addEventListener('mouseenter', () => {
                copyBtn.style.opacity = '1';
            });
            wrapper.addEventListener('mouseleave', () => {
                copyBtn.style.opacity = '0';
            });
            
            copyBtn.addEventListener('click', async () => {
                const code = codeBlock.textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.innerHTML = '✅ Copied!';
                    copyBtn.style.background = '#10b981';
                    copyBtn.style.color = 'white';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋 Copy';
                        copyBtn.style.background = 'rgba(255,255,255,0.9)';
                        copyBtn.style.color = '#333';
                    }, 2000);
                } catch (err) {
                    copyBtn.innerHTML = '❌ Failed';
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋 Copy';
                    }, 2000);
                }
            });
            
            wrapper.appendChild(copyBtn);
        });
        
        // Add hover effect styles
        const styles = document.createElement('style');
        styles.textContent = `
            pre {
                position: relative;
                border-radius: 8px;
                overflow: auto;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // =====================
    // Back to Top Button
    // =====================
    function addBackToTop() {
        const btn = document.createElement('button');
        btn.id = 'post-back-to-top';
        btn.innerHTML = '↑';
        btn.title = 'Back to top';
        btn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
            z-index: 1000;
        `;
        
        document.body.appendChild(btn);
        
        // Show/hide on scroll
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 500) {
                        btn.style.opacity = '1';
                        btn.style.visibility = 'visible';
                    } else {
                        btn.style.opacity = '0';
                        btn.style.visibility = 'hidden';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Scroll to top on click
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // =====================
    // Reading Progress Bar
    // =====================
    function addProgressBar() {
        const bar = document.createElement('div');
        bar.id = 'reading-progress';
        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #7c3aed);
            z-index: 10000;
            transition: width 0.1s;
        `;
        document.body.appendChild(bar);
        
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = (scrollTop / docHeight) * 100;
                    bar.style.width = progress + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    // =====================
    // Highlight Current Section in TOC
    // =====================
    function highlightCurrentSection() {
        const tocLinks = document.querySelectorAll('.toc-link');
        if (tocLinks.length === 0) return;
        
        const headings = Array.from(tocLinks).map(link => 
            document.getElementById(link.dataset.target)
        ).filter(Boolean);
        
        let currentSection = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    currentSection = entry.target.id;
                    updateActiveLink(currentSection);
                }
            });
        }, { rootMargin: '-20% 0px -80% 0px' });
        
        headings.forEach(heading => observer.observe(heading));
    }
    
    function updateActiveLink(sectionId) {
        document.querySelectorAll('.toc-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.target === sectionId) {
                link.classList.add('active');
            }
        });
    }
    
})();
