const CACHE_VERSION = 'v3';
const CACHE_NAME = `${registration.scope}!${CACHE_VERSION}`;

// キャッシュするファイルをセットする
const urlsToCache = [
  '.',
  'お告げによるルービックキューブ解法.html',
  'お告げによるルービックキューブ4x4脱力解法.html',
  'V6拡張.pdf',
  'お告げナビのインストールについて.pdf',
  'index6.html',
  'notation-Mini.html',
  'css/colorPick.css',
  'css/faceStyle.css',
  'css/modal-video.min.css',
  'css/RBstyle3.css',
  'css/RBstyle33.css',
  'css/RBstyle43.css',
  'css/RBstyle44.css',
  'css/RBstyle55.css',
  'css/RBstyle66.css',
  'css/RBstyle77.css',
  'css/RBstyle88.css',
  'images/4rc_1_1_041.gif',
  'images/4rc_1_2.png',
  'images/4rc_1_3.gif',
  'images/4rc_1_4.gif',
  'images/4rc_1_4_008.gif',
  'images/4rc_1_4_46.gif',
  'images/4rc_1_4_47.gif',
  'images/4rc_1_4_48.gif',
  'images/4rc_1_4_49.gif',
  'images/4rc_1_4_50.gif',
  'images/4rc_1_4_91.gif',
  'images/4rc_1_4_92.gif',
  'images/4rc_2_1_05.gif',
  'images/B-.gif',
  'images/B.gif',
  'images/B2.gif',
  'images/crosstype.png',
  'images/CRSchg.png',
  'images/CUBE0.png',
  'images/CUBE0A.png',
  'images/CUBE1.png',
  'images/CUBE2.png',
  'images/CUBE3.png',
  'images/CUBE4.png',
  'images/CUBE5.png',
  'images/CUBE9.png',
  'images/CubeGoal.mp4',
  'images/CUBEm.png',
  'images/CubeRotate.mp4',
  'images/CUBEy.png',
  'images/CUBEyellowBura.png',
  'images/CUBEyellowR.png',
  'images/CUBEyellowL.png',
  'images/CUBEyellowPlusV.png',
  'images/CUBEyellowPlusH.png',
  'images/CUBEyellowKameV.png',
  'images/CUBEyellowKameH.png',
  'images/D-.gif',
  'images/D.gif',
  'images/D2.gif',
  'images/dottype.png',
  'images/F-.gif',
  'images/F-.png',
  'images/F-2.gif',
  'images/F.gif',
  'images/F.png',
  'images/F2.gif',
  'images/F2.png',
  'images/F2L01.png',
  'images/F2L11.png',
  'images/F2L18.png',
  'images/F2L21.png',
  'images/Fc-.gif',
  'images/Fc.gif',
  'images/home.gif',
  'images/hurusato.png',
  'images/iglass.png',
  'images/kabe.gif',
  'images/kame.png',
  'images/L-.gif',
  'images/L.gif',
  'images/L.png',
  'images/L2.gif',
  'images/l2.png',
  'images/linetype.png',
  'images/Lrote.png',
  'images/Ltype.png',
  'images/M-.gif',
  'images/M-2.gif',
  'images/M.gif',
  'images/M180d.gif',
  'images/M180u.gif',
  'images/M2.gif',
  'images/modosi1.png',
  'images/modosi2.png',
  'images/MonoGF2L1.png',
  'images/nth_wood_blocks_bg.gif',
  'images/otsugeEx.png',
  'images/otugeTitle.png',
  'images/otugeTitle7.png',
  'images/R-.gif',
  'images/R-.png',
  'images/R.gif',
  'images/R.png',
  'images/R2.gif',
  'images/R_-.png',
  'images/R_.png',
  'images/Rc-.gif',
  'images/Rc.gif',
  'images/Rrote.png',
  'images/Rubik_scramble.png',
  'images/Rw-.png',
  'images/Rw-_.png',
  'images/Rw.png',
  'images/Rw_.png',
  'images/sozai_10.gif',
  'images/sozai_15.gif',
  'images/sozai_30.gif',
  'images/sozai_35.gif',
  'images/U-.gif',
  'images/U-.png',
  'images/U-2.gif',
  'images/U.gif',
  'images/U.png',
  'images/U2.gif',
  'images/U2.png',
  'images/Uc-.png',
  'images/Uw-.png',
  'images/Uw.png',
  'images/V3拡張.png',
  'images/V4拡張.png',
  'images/world-color.png',
  'images/X-.png',
  'images/X.png',
  'images/X2.gif',
  'images/Y.gif',
  'images/Y.png',
  'images/Y2.gif',
  'js/colorPick.js',
  'js/dragRotation.js',
  'js/faceMain6.js',
  'js/faceMain7.js',
  'js/jquery.min.js',
  'js/jquery-modal-video.min.js',
  'js/navigate6.js',
  'js/revelator6.js',
  'js/revelator7.js',
  'js/rotate6.js',
  'js/scriptMini.js',
  'js/min2phase.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    // キャッシュを開く
    caches.open(CACHE_NAME)
    .then((cache) => {
      // 指定されたファイルをキャッシュに追加する
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => {
        // このスコープに所属していて且つCACHE_NAMEではないキャッシュを探す
        return cacheName.startsWith(`${registration.scope}!`) &&
               cacheName !== CACHE_NAME;
      });
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheName) => {
        // いらないキャッシュを削除する
        return caches.delete(cacheName);
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      // キャッシュ内に該当レスポンスがあれば、それを返す
      if (response) {
        return response;
      }

      // 重要：リクエストを clone する。リクエストは Stream なので
      // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
      // 必要なので、リクエストは clone しないといけない
      let fetchRequest = event.request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            // キャッシュする必要のないタイプのレスポンスならそのまま返す
            return response;
          }

          // 重要：レスポンスを clone する。レスポンスは Stream で
          // ブラウザ用とキャッシュ用の2回必要。なので clone して
          // 2つの Stream があるようにする
          let responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
    })
  );
});