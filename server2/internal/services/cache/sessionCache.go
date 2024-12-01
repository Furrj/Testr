package cache

import (
	"sync"

	"github.com/Furrj/timestrainer/server/internal/services/auth/tokens"
)

type InvalidRefreshTokenMap = map[tokens.TokenId]any

type InvalidRefreshTokenCache struct {
	Tokens InvalidRefreshTokenMap
	Mtx    *sync.Mutex
}

func NewInvalidRefreshTokenCache(m InvalidRefreshTokenMap, mtx *sync.Mutex) *InvalidRefreshTokenCache {
	return &InvalidRefreshTokenCache{
		Tokens: m,
		Mtx:    mtx,
	}
}

func (sc *InvalidRefreshTokenCache) Add(key tokens.TokenId, value any) error {
	sc.Mtx.Lock()
	defer sc.Mtx.Unlock()
	sc.Tokens[key] = value
	return nil
}

func (sc *InvalidRefreshTokenCache) Fetch(key tokens.TokenId) (bool, any) {
	sc.Mtx.Lock()
	defer sc.Mtx.Unlock()
	val, exists := sc.Tokens[key]
	if !exists {
		var zero any
		return false, zero
	}
	return true, val
}

func (sc *InvalidRefreshTokenCache) Remove(key tokens.TokenId) {
	sc.Mtx.Lock()
	defer sc.Mtx.Unlock()
	delete(sc.Tokens, key)
}

func (sc *InvalidRefreshTokenCache) Size() uint {
	return uint(len(sc.Tokens))
}
