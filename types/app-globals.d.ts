// 생성자 주입(DI)으로만 넘어오는 자체 클래스들을 전역 타입으로 노출한다.
// JSDoc에서 @param {IndexedDB} 처럼 import 없이 짧은 이름으로 참조하기 위함.
// (런타임과 무관한 타입 전용 파일 — 확장 빌드에는 포함되지 않는다. src/ 밖에 둔 이유.)
declare global {
  type IndexedDB = import('../src/js/store/IndexedDB.js').IndexedDB
  type ThrottledQueue = import('../src/js/background/ThrottledQueue.js').ThrottledQueue
  type CircuitBreaker = import('../src/js/background/CircuitBreaker.js').CircuitBreaker
}

export {}
