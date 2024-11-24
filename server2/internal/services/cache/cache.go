package cache

type Cache[K comparable, V any] interface {
	Add(key K, value V) error
	Fetch(key K) (bool, V)
	Remove(key K)
	Size() uint
}
