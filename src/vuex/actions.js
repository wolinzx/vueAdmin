//test

export const increment = ({commit}) => {
    commit('INCREMENT')
}
export const decrement = ({commit}) => {
    commit('DECREMENT')
}
export const getAccount = ({commit}) => {
  commit('GETACCOUNT',JSON.parse(sessionStorage.getItem('user')).account)
}