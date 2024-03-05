
export const logout = (setUser, navigate) => {
    setUser(null)
    localStorage.clear()
    sessionStorage.clear()
    navigate('/')
}