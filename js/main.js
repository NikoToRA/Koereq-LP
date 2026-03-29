// コエレクLP メインJavaScript

document.addEventListener('DOMContentLoaded', function() {

  // ========================================
  // モバイル固定CTA表示制御（スクロール後に表示）
  // ========================================
  const heroCta = document.querySelector('.hero-cta-wrapper');
  const topVideoProof = document.querySelector('.top-video-proof');

  if (heroCta && topVideoProof) {
    // スクロール位置で制御
    function checkCtaVisibility() {
      const rect = topVideoProof.getBoundingClientRect();
      // top-video-proofの下端が画面上端を超えたらCTAを表示
      if (rect.bottom < 0) {
        heroCta.classList.add('visible');
      } else {
        heroCta.classList.remove('visible');
      }
    }

    // スクロールイベントで監視
    window.addEventListener('scroll', checkCtaVisibility, { passive: true });
    // 初期状態チェック
    checkCtaVisibility();
  }

  // ========================================
  // スクロールアニメーション（Intersection Observer）
  // ========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // アニメーション対象の要素を監視
  const animateElements = document.querySelectorAll(
    '.problem-item, .wall-item, .future-item, .step-item, .benefit-item, .testimonial-item, .security-item'
  );

  animateElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });

  // ストーリーブロックのスクロールアニメーション
  const storyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.story-block').forEach(el => {
    storyObserver.observe(el);
  });

  // ========================================
  // 数字カウントアップアニメーション
  // ========================================
  function animateNumber(element, target, suffix = '', duration = 2000) {
    const startText = (element.textContent || '').trim();
    const startMatch = startText.match(/\d+/);
    const start = startMatch ? parseInt(startMatch[0], 10) : 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current) + suffix;
    }, 16);
  }

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function triggerCountUp(element) {
    if (!element || element.dataset.animated) return;

    const targetValue = parseInt(element.dataset.target, 10);
    const suffix = element.dataset.suffix || '';

    if (!Number.isFinite(targetValue)) return;

    if (prefersReducedMotion) {
      element.textContent = String(targetValue) + suffix;
      element.dataset.animated = 'true';
      return;
    }

    animateNumber(element, targetValue, suffix);
    element.dataset.animated = 'true';
  }

  // 数値表示要素を監視してアニメーション実行（未対応環境のフォールバックあり）
  const canUseIntersectionObserver = 'IntersectionObserver' in window;
  const numberObserver = canUseIntersectionObserver
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              triggerCountUp(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      )
    : null;

  // カウントアップ対象要素
  document.querySelectorAll('.stat-number').forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/\d+/);
    if (match) {
      el.dataset.target = match[0];
      el.dataset.suffix = text.replace(match[0], '');
      // 初期表示はそのまま（80/16など）にしておく。

      // 基本はスクロールで起動。Observerが使えない/発火しない環境でも確実に表示されるように保険を入れる。
      if (numberObserver) {
        numberObserver.observe(el);
      } else {
        // 古い環境: アニメーションなし（初期表示の数値を保持）
      }

      // NOTE:
      // 以前は「0→目標値」のアニメーションを強制起動していましたが、
      // 環境によってはアニメーションが発火せず“0のまま”になるリスクがあるため、
      // 初期表示の数値（80/16など）を優先して保持します。
    }
  });

  // ========================================
  // FAQアコーディオン
  // ========================================
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const toggle = question.querySelector('.faq-toggle');
      const isOpen = answer.classList.contains('open');

      // 現在開いているFAQを閉じる
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.classList.remove('open');
      });

      document.querySelectorAll('.faq-toggle').forEach(t => {
        t.textContent = '+';
        t.style.transform = 'rotate(0deg)';
      });

      // クリックされたFAQを開く（既に開いていなければ）
      if (!isOpen) {
        answer.classList.add('open');
        toggle.textContent = '−';
        toggle.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ========================================
  // 動画モーダル（YouTube / mp4：クリックで再生 / 閉じたら停止）
  // ========================================
  const videoModal = document.querySelector('.js-video-modal');
  const videoModalIframe = document.querySelector('.js-video-modal-iframe');
  const videoModalVideo = document.querySelector('.js-video-modal-video');

  function openVideoModal({ videoId, videoSrc, titleText }) {
    if (!videoModal) return;

    const safeTitle = titleText || '動画を再生';

    // Reset both players first
    if (videoModalIframe) {
      videoModalIframe.classList.remove('is-active');
      videoModalIframe.setAttribute('title', '');
      videoModalIframe.setAttribute('src', '');
    }
    if (videoModalVideo) {
      videoModalVideo.classList.remove('is-active');
      try {
        videoModalVideo.pause();
      } catch (_) {}
      videoModalVideo.removeAttribute('src');
      videoModalVideo.load();
    }

    if (videoSrc && videoModalVideo) {
      videoModalVideo.setAttribute('src', videoSrc);
      videoModalVideo.classList.add('is-active');
      // User gesture (click) should allow play; ignore failures (autoplay policies etc.)
      try {
        const maybePromise = videoModalVideo.play();
        if (maybePromise && typeof maybePromise.catch === 'function') {
          maybePromise.catch(() => {});
        }
      } catch (_) {}
    } else if (videoId && videoModalIframe) {
      const src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`;
      videoModalIframe.setAttribute('src', src);
      videoModalIframe.setAttribute('title', safeTitle);
      videoModalIframe.classList.add('is-active');
    } else {
      // Nothing to play
      return;
    }

    videoModal.classList.add('is-open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModal) return;

    videoModal.classList.remove('is-open');
    videoModal.setAttribute('aria-hidden', 'true');

    // Stop playback (YouTube)
    if (videoModalIframe) {
      videoModalIframe.classList.remove('is-active');
      videoModalIframe.setAttribute('src', '');
      videoModalIframe.setAttribute('title', '');
    }

    // Stop playback (mp4)
    if (videoModalVideo) {
      videoModalVideo.classList.remove('is-active');
      try {
        videoModalVideo.pause();
      } catch (_) {}
      videoModalVideo.removeAttribute('src');
      videoModalVideo.load();
    }

    document.documentElement.style.overflow = '';
  }

  document.querySelectorAll('.js-video-modal-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const videoId = trigger.getAttribute('data-video-id');
      const videoSrc = trigger.getAttribute('data-video-src');
      const titleText = trigger.getAttribute('data-video-title') || '動画を再生';
      openVideoModal({ videoId, videoSrc, titleText });
    });
  });

  document.querySelectorAll('.js-video-modal-close').forEach((closer) => {
    closer.addEventListener('click', closeVideoModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal?.classList.contains('is-open')) {
      closeVideoModal();
    }
  });

  // ========================================
  // ヘッダー背景透明度（スクロール時）
  // ========================================
  const header = document.querySelector('.header-fixed');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // スクロール量に応じて背景の不透明度を調整
    if (currentScroll > 50) {
      header.style.background = 'rgba(255, 255, 255, 1)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.95)';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
  });

  // ========================================
  // CTAボタンクリック追跡（Google Analytics用）
  // ========================================
  document.querySelectorAll('.cta-button-primary, .cta-button-secondary').forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      const sectionId = this.closest('section')?.id || 'unknown';

      // Google Analytics イベント送信（GA4設定後に有効化）
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': buttonText,
          'event_section': sectionId
        });
      }

      console.log('CTA clicked:', buttonText, 'in section:', sectionId);
    });
  });

  // ========================================
  // スクロール深度トラッキング（Google Analytics用）
  // ========================================
  let scrollDepthMarkers = [25, 50, 75, 100];
  let scrollDepthTriggered = [];

  window.addEventListener('scroll', () => {
    const scrollPercentage = (window.pageYOffset + window.innerHeight) / document.documentElement.scrollHeight * 100;

    scrollDepthMarkers.forEach(marker => {
      if (scrollPercentage >= marker && !scrollDepthTriggered.includes(marker)) {
        scrollDepthTriggered.push(marker);

        // Google Analytics イベント送信（GA4設定後に有効化）
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll_depth', {
            'event_category': 'engagement',
            'event_label': marker + '%'
          });
        }

        console.log('Scroll depth:', marker + '%');
      }
    });
  });

  // ========================================
  // 動画再生トラッキング（動画追加後に有効化）
  // ========================================
  /*
  document.querySelectorAll('video').forEach(video => {
    let videoPlayed = false;

    video.addEventListener('play', function() {
      if (!videoPlayed) {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'video_play', {
            'event_category': 'engagement',
            'event_label': 'demo_video'
          });
        }
        videoPlayed = true;
        console.log('Video played: demo_video');
      }
    });
  });
  */

  // ========================================
  // 使用例モーダル（スライダー付きチャット）
  // ========================================
  var useCaseData = {
    karte: {
      title: 'カルテ作成',
      slides: [
        {
          voices: [
            '50歳男性、胸痛で来院。2時間前に突然の胸骨後部の圧迫感が出現しました。冷汗あり。',
            'バイタル。血圧178/102、脈拍92、SpO2 97%。',
            '心電図でST上昇あり、トロポニン陽性です。循環器内科にコンサルト済み、緊急カテ予定です。'
          ],
          result: '【主訴】胸痛\n【現病歴】\n  2時間前に突然の胸骨後部圧迫感が出現。\n  冷汗を伴う。\n【バイタルサイン】\n  BP: 178/102 mmHg\n  HR: 92 bpm\n  SpO2: 97%\n【検査所見】\n  心電図: ST上昇あり\n  トロポニン: 陽性\n【対応】\n  循環器内科コンサルト済み\n  緊急カテーテル検査予定'
        },
        {
          voices: [
            '80歳女性、自宅で転倒して右大腿部の痛み。歩行困難で搬送。',
            'バイタル。血圧142/88、脈拍78、SpO2 98%。体温36.2。',
            'X線で右大腿骨頸部骨折を確認。整形外科コンサルト。手術予定。'
          ],
          result: '【主訴】右大腿部痛\n【現病歴】\n  自宅にて転倒。右大腿部痛を訴え、\n  歩行困難のため救急搬送。\n【バイタルサイン】\n  BP: 142/88 mmHg\n  HR: 78 bpm\n  SpO2: 98%\n  BT: 36.2℃\n【検査所見】\n  X線: 右大腿骨頸部骨折\n【対応】\n  整形外科コンサルト済み\n  手術予定'
        }
      ]
    },
    referral: {
      title: '紹介状作成',
      slides: [
        {
          voices: [
            'いつもお世話になっております。右下腹部痛で来院された45歳女性をご紹介します。',
            '来院時CTにて虫垂の腫大および周囲の脂肪織混濁を認め、急性虫垂炎と診断しました。',
            '抗菌薬投与を開始しておりますが、外科的加療が必要と考え、ご高診のほどよろしくお願いいたします。'
          ],
          result: '御侍史\n\n拝啓 時下益々ご清祥のこととお慶び\n申し上げます。\n\n【患者情報】45歳 女性\n【診断】急性虫垂炎\n【現病歴】\n  右下腹部痛を主訴に当院救急外来を受診。\n【検査所見】\n  腹部CT: 虫垂腫大、周囲脂肪織混濁あり\n【現在の治療】\n  抗菌薬投与開始\n【紹介目的】\n  外科的加療についてご検討いただきたく、\n  ご紹介申し上げます。\n\nご高診のほど、何卒よろしく\nお願い申し上げます。\n\n敬具'
        },
        {
          voices: [
            '糖尿病のコントロール不良で来院した62歳男性です。HbA1c 9.8%。',
            '現在メトホルミン500mg2錠で治療中ですが、食事療法がうまくいっていない状況です。',
            'インスリン導入を含めた治療強化のため、糖尿病専門外来へのご紹介をお願いします。'
          ],
          result: '御侍史\n\n拝啓 時下益々ご清祥のこととお慶び\n申し上げます。\n\n【患者情報】62歳 男性\n【診断】2型糖尿病（コントロール不良）\n【現病歴】\n  メトホルミン500mg×2錠にて加療中。\n  食事療法の遵守が困難な状況。\n【検査所見】\n  HbA1c: 9.8%\n【現在の治療】\n  メトホルミン 500mg 2T/日\n【紹介目的】\n  インスリン導入を含めた治療強化について\n  ご検討いただきたく存じます。\n\nご高診のほど、何卒よろしく\nお願い申し上げます。\n\n敬具'
        }
      ]
    },
    ic: {
      title: 'IC記録',
      slides: [
        {
          voices: [
            '患者さんとご家族に対して、急性心筋梗塞の診断結果について説明しました。',
            '緊急カテーテル検査および必要に応じてステント留置術を行う方針をお伝えしました。',
            '合併症として出血、血管損傷、造影剤アレルギーのリスクについて説明。患者さんご家族ともに理解され、同意書に署名いただきました。'
          ],
          result: '【IC記録】\n  実施日時: 2024年XX月XX日\n  説明医師: ○○ ○○\n  同席者: 患者本人、ご家族\n\n【説明内容】\n  1. 診断: 急性心筋梗塞\n  2. 治療方針: 緊急カテーテル検査\n     → 必要に応じてステント留置術\n  3. 合併症リスク:\n     - 出血\n     - 血管損傷\n     - 造影剤アレルギー\n\n【患者・家族の反応】\n  説明内容を理解され、同意\n\n【同意】同意書署名済み'
        },
        {
          voices: [
            '70歳男性に大腸ポリープ切除術について説明しました。',
            '内視鏡的粘膜切除術を予定しており、偶発症として出血と穿孔のリスクがあることを説明。',
            '術後は1週間の食事制限と安静が必要であることをお伝えし、同意をいただきました。'
          ],
          result: '【IC記録】\n  実施日時: 2024年XX月XX日\n  説明医師: ○○ ○○\n  同席者: 患者本人\n\n【説明内容】\n  1. 診断: 大腸ポリープ\n  2. 治療方針: 内視鏡的粘膜切除術（EMR）\n  3. 偶発症リスク:\n     - 出血\n     - 穿孔\n  4. 術後管理:\n     - 1週間の食事制限\n     - 安静\n\n【患者の反応】\n  説明内容を理解され、同意\n\n【同意】同意書署名済み'
        }
      ]
    }
  };

  var useCaseModal = document.getElementById('useCaseModal');
  var useCaseModalTitle = document.getElementById('useCaseModalTitle');
  var useCaseSliderTrack = document.getElementById('useCaseSliderTrack');
  var useCasePrev = document.getElementById('useCasePrev');
  var useCaseNext = document.getElementById('useCaseNext');
  var useCaseIndicator = document.getElementById('useCaseIndicator');
  var currentSlideIndex = 0;
  var currentSlides = [];

  function buildChatSlide(slideData) {
    var slide = document.createElement('div');
    slide.className = 'use-case-slide';

    var labelVoice = document.createElement('div');
    labelVoice.className = 'use-case-chat-label';
    labelVoice.textContent = '音声入力';
    slide.appendChild(labelVoice);

    slideData.voices.forEach(function(text) {
      var row = document.createElement('div');
      row.className = 'use-case-chat-row use-case-chat-row--right';
      var bubble = document.createElement('div');
      bubble.className = 'use-case-chat-bubble use-case-chat-bubble--voice';
      bubble.textContent = text;
      row.appendChild(bubble);
      slide.appendChild(row);
    });

    var labelResult = document.createElement('div');
    labelResult.className = 'use-case-chat-label';
    labelResult.textContent = 'AI変換結果';
    slide.appendChild(labelResult);

    var rowResult = document.createElement('div');
    rowResult.className = 'use-case-chat-row use-case-chat-row--left';
    var bubbleResult = document.createElement('pre');
    bubbleResult.className = 'use-case-chat-bubble use-case-chat-bubble--result';
    bubbleResult.textContent = slideData.result;
    rowResult.appendChild(bubbleResult);
    slide.appendChild(rowResult);

    return slide;
  }

  function updateSlider() {
    if (!useCaseSliderTrack) return;
    useCaseSliderTrack.style.transform = 'translateX(-' + (currentSlideIndex * 100) + '%)';
    useCaseIndicator.textContent = (currentSlideIndex + 1) + ' / ' + currentSlides.length;
    useCasePrev.disabled = currentSlideIndex === 0;
    useCaseNext.disabled = currentSlideIndex === currentSlides.length - 1;
  }

  function openUseCaseModal(key) {
    var data = useCaseData[key];
    if (!data || !useCaseModal) return;
    useCaseModalTitle.textContent = data.title;
    currentSlides = data.slides;
    currentSlideIndex = 0;

    useCaseSliderTrack.innerHTML = '';
    currentSlides.forEach(function(slideData) {
      useCaseSliderTrack.appendChild(buildChatSlide(slideData));
    });

    updateSlider();
    useCaseModal.classList.add('is-open');
    useCaseModal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeUseCaseModal() {
    if (!useCaseModal) return;
    useCaseModal.classList.remove('is-open');
    useCaseModal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
  }

  if (useCasePrev) {
    useCasePrev.addEventListener('click', function() {
      if (currentSlideIndex > 0) { currentSlideIndex--; updateSlider(); }
    });
  }
  if (useCaseNext) {
    useCaseNext.addEventListener('click', function() {
      if (currentSlideIndex < currentSlides.length - 1) { currentSlideIndex++; updateSlider(); }
    });
  }

  document.querySelectorAll('.use-case-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var key = card.getAttribute('data-use-case');
      openUseCaseModal(key);
    });
  });

  var useCaseCloseBtn = useCaseModal ? useCaseModal.querySelector('.use-case-modal-close') : null;
  if (useCaseCloseBtn) {
    useCaseCloseBtn.addEventListener('click', closeUseCaseModal);
  }

  if (useCaseModal) {
    useCaseModal.addEventListener('click', function(e) {
      if (e.target === useCaseModal) {
        closeUseCaseModal();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && useCaseModal && useCaseModal.classList.contains('is-open')) {
      closeUseCaseModal();
    }
  });

  // ========================================
  // 初期化完了ログ
  // ========================================
  console.log('✅ Koereq LP: JavaScript initialized');
});
