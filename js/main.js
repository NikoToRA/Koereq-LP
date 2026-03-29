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
            '50歳男性、安静時に胸痛。冷や汗をかいて動けない。救急要請。',
            '既往歴、特になし。高血圧の指摘があるが治療していない。',
            'バイタル。意識レベルクリア、血圧170/102、脈拍92回不整あり、サチ98%ルームエア、体温36.5度。',
            '心電図でII、III、aVFにST上昇あり。',
            'トロポニン陽性。',
            '心エコーで下壁の運動低下。',
            'アレルギーなし、ADL自立、タバコ1日20本30年。',
            '循環器内科コンサルト。'
          ],
          result: '【主訴】胸痛\n\n【現病歴】\n  安静時に突然の胸痛が出現。\n  冷汗を伴い体動困難となり救急要請。\n\n【既往歴】\n  特記事項なし\n  高血圧の指摘あり（未治療）\n\n【内服薬】\n  なし\n\n【生活歴】\n  喫煙: 20本/日 × 30年（30 pack-years）\n  ADL: 自立\n  アレルギー: なし\n\n【バイタルサイン】\n  意識: JCS 0（清明）\n  BP: 170/102 mmHg\n  HR: 92 bpm（不整あり）\n  SpO2: 98%（室内気）\n  BT: 36.5℃\n\n【身体所見】\n  冷汗著明、胸部圧迫感の訴えあり\n\n【搬送後経過】\n  12誘導心電図を施行\n  血液検査・心エコー施行\n\n【検査結果】\n  心電図: II, III, aVF にST上昇\n  トロポニン: 陽性\n  心エコー: 下壁の壁運動低下\n\n【診断】\n  急性下壁心筋梗塞（STEMI）\n\n【方針とアウトカム】\n  循環器内科コンサルト\n  緊急心臓カテーテル検査の方針'
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
