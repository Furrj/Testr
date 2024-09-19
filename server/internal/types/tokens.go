package types

type AccessToken = string

type RefreshToken = string

type AllTokens struct {
	AccessToken  AccessToken  `json:"access_token"`
	RefreshToken RefreshToken `json:"refresh_token"`
}
