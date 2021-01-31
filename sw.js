const staticCache = 'static-v1'
const dynamicCache = 'dynamic-v1'
const inmutableCache = 'inmutable-v1'

importScripts('js/swUtils.js')

const appShell = [
    '/',
    '/index.html',
    'css/style.css',
    'img/favicon.png',
    'img/favicon.png',
    'img/hero-small.jpg',
    'img/hero.jpg',
    'img/logo-green-1x.png',
    'img/logo-green-2x.png',
    'img/logo-green-small-1x.png',
    'img/logo-green-small-2x.png',
    'img/logo-white.png',
    'img/nat-1.jpg',
    'img/nat-1-large.jpg',
    'img/nat-2-large.jpg',
    'img/nat-2.jpg',
    'img/nat-3-large.jpg',
    'img/nat-3.jpg',
    'img/nat-4.jpg',
    'img/nat-5.jpg',
    'img/nat-6.jpg',
    'img/nat-7.jpg',
    'img/nat-8.jpg',
    'img/nat-9.jpg',
    'img/nat-10.jpg',
]

const appShellInmutable = [
    'https://fonts.googleapis.com/css?family=Lato:100,300,400,700,900',
]

self.addEventListener('install', e => {
    const saveStaticCache = caches.open(staticCache).then(cache => {
        cache.addAll(appShell)
    })

    const saveInmutableCache = caches.open(inmutableCache).then(cache => {
        cache.addAll(appShellInmutable)
    })

    e.waitUntil(Promise.all([saveStaticCache, saveInmutableCache]))
})

self.addEventListener('activate', e => {
    const cleanCache = caches.keys().then(key => {
        if(key !== staticCache && key.includes('static')) {
            return caches.delete(key)
        }

        if(key !== dynamicCache && key.includes('dynamic')) {
            return caches.delete(key)
        }

        if(key !== inmutableCache && key.includes('inmutable')) {
            return caches.delete(key)
        }
    })

    e.waitUntil(cleanCache)
})

self.addEventListener('fetch', e => {
    const res = caches.match(e.request).then(res => {
        if(!res){
            return fetch(e.request).then(newRes => {
                return updateDynamicCache(dynamicCache, e.request, newRes)
            })
        }

        return res
    })

    e.respondWith(res)
})