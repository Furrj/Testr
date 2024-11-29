package tokens

import "time"

type TokenManager[T, J any] interface {
	Create(T) (J, error)
	Unmarshall(J) (T, error)
	GetValidDuration() time.Duration
}
