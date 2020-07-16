const getters = {
  userid: state => state.user.userid,
  token: state => state.user.token,
  menuList: state => JSON.parse(state.user.menuList),
  // !!将强制转换为布尔值，若存在且不为空(已登录)则返回true，反之返回false
  isLoggedIn: state => !!state.user.userid,
  bg: state => state.app.bg,
}
export default getters
