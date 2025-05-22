import type { MutationTree, ActionTree, GetterTree } from 'vuex';

interface User {
  fullName: string;
  email: string;
  role: string;
  points: number;
  avatar: string;
}

interface State {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean; 
}

const state: State = {
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const mutations: MutationTree<State> = {
  setToken(state, token: string) {
    state.token = token;
    state.isAuthenticated = !!token;
    localStorage.setItem('token', token);
  },
  setUser(state, user: User) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  },
  logout(state) {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

const actions: ActionTree<State, any> = {
  login({ commit }, { token, user }: { token: string; user: User }) {
    commit('setToken', token);
    commit('setUser', user);
  },
  logout({ commit }) {
    commit('logout');
  },
};

const getters: GetterTree<State, any> = {
  getToken(state): string | null {
    return state.token;
  },
  getUser(state): User | null {
    return state.user;
  },
  isAuthenticated(state): boolean {
    return state.isAuthenticated; 
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
