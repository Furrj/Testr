const generateJwt = (token: string): string => `Bearer ${token}`;

export default generateJwt;
