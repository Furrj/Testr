package cache

import (
	"sync"
)

type SessionCache[K comparable, V any] struct {
	Sessions map[K]V
	Mtx      *sync.Mutex
}

func NewSessionCache[K comparable, V any]() *SessionCache[K, V] {
	return &SessionCache[K, V]{
		Sessions: make(map[K]V),
		Mtx:      &sync.Mutex{},
	}
}

func (sc *SessionCache[K, V]) Add(key K, value V) error {
	sc.Mtx.Lock()
	defer sc.Mtx.Unlock()
	sc.Sessions[key] = value
	return nil
}

func (sc *SessionCache[K, V]) Fetch(key K) (bool, V) {
	sc.Mtx.Lock()
	defer sc.Mtx.Unlock()
	val, exists := sc.Sessions[key]
	if !exists {
		var zero V
		return false, zero
	}
	return true, val
}

func (sc *SessionCache[K, V]) Remove(key K) {
	delete(sc.Sessions, key)
}

func (sc *SessionCache[K, V]) Size() uint {
	return uint(len(sc.Sessions))
}
