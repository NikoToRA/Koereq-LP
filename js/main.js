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
  // 申込動線のボタンだけを対象にする。
  // cta-button-secondary は動画モーダルを開くボタンであり申込ではないため含めない
  // （含めるとCVRが実態より高く出る）。動画は下の video_play で別途計測する。
  document.querySelectorAll('.cta-button-header, .cta-button-primary').forEach(button => {
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      const sectionId = this.closest('section')?.id
        || (this.closest('header') ? 'header' : 'unknown');

      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': buttonText,
          'event_section': sectionId
        });
      }
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
  // 動画再生トラッキング
  // ========================================
  // 動画は全てYouTube埋め込みに移行したため、<video> 要素ではなく
  // モーダルを開くトリガー（=再生開始の意思表示）を計測対象にする
  document.querySelectorAll('.js-video-modal-trigger').forEach(trigger => {
    trigger.addEventListener('click', function() {
      if (typeof gtag === 'undefined') return;
      gtag('event', 'video_play', {
        'event_category': 'engagement',
        'event_label': this.getAttribute('data-video-title') || 'unknown',
        'event_section': this.closest('section')?.id || 'unknown'
      });
    });
  });

  // ========================================
  // 使用例モーダル（スライダー付きチャット）
  // ========================================
  var useCaseData = {
    karte: {
      title: 'カルテ作成',
      slides: [
        {
          action: '【カルテ作成】',
          voices: [
            '50歳男性、安静時に胸痛。冷や汗をかいて動けない。救急要請。',
            '既往歴、特になし。高血圧の指摘があるが治療していない。',
            'バイタル。意識レベルクリア、血圧170/102、脈拍92回不整あり、サチ98%ルームエア、体温36.5度。',
            '心電図でII、III、aVFにST上昇あり。',
            'トロポニン陽性。',
            '心エコーで下壁の運動低下。',
            'アレルギーなし、ADL自立、タバコ1日20本30年。',
            '循環器内科コンサルト。',
            '緊急カテーテルとなった。'
          ],
          result: '【主訴】胸痛\n\n【現病歴】\n  安静時に突然の胸痛が出現。\n  冷汗を伴い体動困難となり救急要請。\n\n【既往歴】\n  特記事項なし\n  高血圧の指摘あり（未治療）\n\n【内服薬】\n  なし\n\n【生活歴】\n  喫煙: 20本/日 × 30年（30 pack-years）\n  ADL: 自立\n  アレルギー: なし\n\n【バイタルサイン】\n  意識: JCS 0（清明）\n  BP: 170/102 mmHg\n  HR: 92 bpm（不整あり）\n  SpO2: 98%（室内気）\n  BT: 36.5℃\n\n【身体所見】\n  冷汗著明、胸部圧迫感の訴えあり\n\n【搬送後経過】\n  12誘導心電図を施行\n  血液検査・心エコー施行\n\n【検査結果】\n  心電図: II, III, aVF にST上昇\n  トロポニン: 陽性\n  心エコー: 下壁の壁運動低下\n\n【診断】\n  急性下壁心筋梗塞（STEMI）\n\n【方針とアウトカム】\n  循環器内科コンサルト\n  緊急心臓カテーテル検査施行'
        }
      ]
    },
    referral: {
      title: '紹介状作成',
      slides: [
        {
          action: '【紹介状作成】',
          voices: [
            '80歳男性、施設入所中。ADL車椅子。本日施設内で発熱とサチ低下で救急搬送。',
            '誤嚥性肺炎の診断。CTで右肺浸潤影。CRP 12、白血球14000。',
            '既往歴、認知症、高血圧、腰椎圧迫骨折。',
            '酸素3Lでサチ98%。抗菌薬タゾピペ4.5g開始。',
            '転院よろしく。家族は集学的治療希望されていません。'
          ],
          result: '平素より大変お世話になっております。\nこの度、上記患者様の転院をお願いしたく、\nご紹介させていただきます。\n\n80歳男性、施設入所中（ADL車椅子）の方です。\n本日、入所中の施設にて発熱および\nSpO2低下を認め、当院救急外来へ搬送されました。\n既往歴は高血圧、認知症、腰椎圧迫骨折です。\n\n検査の結果、胸部CTにて右肺に浸潤影を認め、\n採血ではCRP 12 mg/dL、WBC 14,000/μLと\n炎症反応の上昇を認めました。\n以上より誤嚥性肺炎と診断いたしました。\n\n現在、酸素3L/min経鼻投与下で\nSpO2 98%と安定しており、\n抗菌薬はピペラシリンタゾバクタム\n（TAZ/PIPC）4.5gの投与を開始しております。\n\nなお、ご家族は集学的治療を\n希望されておりません。\n\n大変お忙しいところ誠に申し訳ありませんが、\n今後のご加療どうぞよろしくお願いいたします。'
        }
      ]
    },
    ic: {
      title: 'IC記録',
      slides: [
        {
          action: '【IC記録作成】',
          voices: [
            'これから病状について話をします。本日朝から熱があって、サチュレーションが下がった、酸素濃度が悪くなったということで救急搬送されてきました。',
            '現状の話をすると肺炎という診断になります。もともとADLも高くない状態で、食事が誤嚥という形で喉を通らずに肺に落ちたせいで炎症起こして肺炎を起こしているという状況です。',
            '今は酸素3リットルの投与が必要で、抗菌薬を使った治療が必要になります。入院して治療することになります。',
            '何か質問はありますか？',
            'どれくらいの治療期間になりますか？入院期間はどれくらいになりますか？',
            '一般的には1週間から2週間というような形が多いかなと思います。こちらの病院は急性期の病院なので、ある程度治療方針が決まったところでリハビリに必要な病院へ転院するということが起こりうるかと思います。'
          ],
          result: '【IC記録】\n\n・本日朝より発熱およびSpO2低下があり\n  救急搬送にて来院した\n・診断は誤嚥性肺炎である\n・もともとADLが高くない状態で、\n  誤嚥により肺に炎症を起こしている\n・現在、酸素3L/minの投与が必要な状態である\n・抗菌薬を使用した治療が必要であり、\n  入院して治療を行う\n・入院期間は一般的に1〜2週間程度である\n・当院は急性期病院のため、\n  治療方針が決まった段階で\n  リハビリ目的の病院へ転院となる\n  可能性がある\n\n【合意事項】\n  上記内容について説明し、理解・同意を得た'
        }
      ]
    }
  };

  var useCaseModal = document.getElementById('useCaseModal');
  var useCaseModalTitle = document.getElementById('useCaseModalTitle');
  var useCaseChatScroll = document.getElementById('useCaseChatScroll');
  var useCaseCloseBtn = document.getElementById('useCaseCloseBtn');

  function buildChatFlow(slides) {
    var fragment = document.createDocumentFragment();

    slides.forEach(function(slideData, idx) {
      if (idx > 0) {
        var sep = document.createElement('div');
        sep.className = 'use-case-chat-separator';
        var sepText = document.createElement('span');
        sepText.className = 'use-case-chat-separator-text';
        sepText.textContent = '事例 ' + (idx + 1);
        sep.appendChild(sepText);
        fragment.appendChild(sep);
      }

      var labelVoice = document.createElement('div');
      labelVoice.className = 'use-case-chat-label';
      labelVoice.textContent = '音声入力';
      fragment.appendChild(labelVoice);

      slideData.voices.forEach(function(text) {
        var row = document.createElement('div');
        row.className = 'use-case-chat-row use-case-chat-row--right';
        var bubble = document.createElement('div');
        bubble.className = 'use-case-chat-bubble use-case-chat-bubble--voice';
        bubble.textContent = text;
        row.appendChild(bubble);
        fragment.appendChild(row);
      });

      var actionRow = document.createElement('div');
      actionRow.className = 'use-case-chat-row use-case-chat-row--right';
      var actionBubble = document.createElement('div');
      actionBubble.className = 'use-case-chat-bubble use-case-chat-bubble--voice';
      actionBubble.textContent = slideData.action;
      actionRow.appendChild(actionBubble);
      fragment.appendChild(actionRow);

      var labelResult = document.createElement('div');
      labelResult.className = 'use-case-chat-label';
      labelResult.textContent = 'AI変換結果';
      fragment.appendChild(labelResult);

      var rowResult = document.createElement('div');
      rowResult.className = 'use-case-chat-row use-case-chat-row--left';
      var bubbleResult = document.createElement('pre');
      bubbleResult.className = 'use-case-chat-bubble use-case-chat-bubble--result';
      bubbleResult.textContent = slideData.result;
      rowResult.appendChild(bubbleResult);
      fragment.appendChild(rowResult);
    });

    return fragment;
  }

  function openUseCaseModal(key) {
    var data = useCaseData[key];
    if (!data || !useCaseModal) return;
    useCaseModalTitle.textContent = data.title;

    useCaseChatScroll.innerHTML = '';
    useCaseChatScroll.appendChild(buildChatFlow(data.slides));
    useCaseChatScroll.scrollTop = 0;

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

  document.querySelectorAll('.use-case-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var key = card.getAttribute('data-use-case');
      openUseCaseModal(key);
    });
  });

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
