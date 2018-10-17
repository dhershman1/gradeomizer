/* global document, shuffleSeed, kyanite */

const K = kyanite
const { shuffle } = shuffleSeed
const studentList = [
  'Alex Joo',
  'Alexander Perry',
  'Alexandra Cole',
  'Barry Akers',
  'Bill McCutchan',
  'Catherine Levengood',
  'Colin Burns',
  'Dana Shelton',
  'Eric Tolliver',
  'Erin Clancy',
  'Hayley Hartman',
  'Jason Barnett',
  'Joe Burnett',
  'Karol Buczek',
  'Katie Moon',
  'Kayla Himmelberger',
  'Kristian Neely',
  'Larry Lightner',
  'Lauren Santosuosso',
  'Logan Blueter',
  'Mark Piscioneri',
  'Matther Frey',
  'Michael Bixel',
  'Nathan Becker',
  'Nathan Golba',
  'Nicholas Miesmer',
  'Nicholette Sams',
  'Richard Dobrzeniecki',
  'Sarah Barry',
  'Sarah Lopriore',
  'Stephen Simko',
  'Todd Zverloff',
  'Will Burch',
  'Youssef Hamid'
]

const store = {
  state: {
    taCount: 1,
    currSeed: 'r3p1ac3m3',
    seedsUsed: [],
  },

  mutations: {
    setTACount (state, data) {
      state.taCount = Number(data)
    },

    setSeed (state, data) {
      state.currSeed = data
    },

    setupLists (state) {
      state.lists = K.map(() => [], K.range([0, state.taCount]))
    },

    addSeed (state, seed) {
      state.seedsUsed = K.concat(seed, state.seedsUsed)
    }
  }
}

/**
 * @name createStuList
 * @description Creates a new div which is a list of students
 * @param {Number} ta The current TA number we are on
 * @param {Array} data This is the list of student strings
 * @return {Element} A newly created div element containing the names of the provided students
 */
const createStuList = (ta, data) => {
  const div = document.createElement('div')
  const header = document.createElement('h4')

  header.textContent = `TA ${ta} List`
  div.id = `list-${ta}`
  div.classList.add('namelist')
  div.appendChild(header)
  data.forEach(stu => {
    const p = document.createElement('p')

    p.textContent = stu

    div.appendChild(p)
  })

  return div
}

/**
 * @name generateShuffledLists
 * @description Uses a seed to shuffle our student list and generates individual ones
 * @param {Object} store The store object
 * @param {String} seed The seed used to shuffle the given array
 * @return {Array} A new array of shuffled lists
 */
const generateShuffledLists = ({ state, mutations }) => {
  const total = state.taCount - 1
  let lists = []
  let remainder = [...studentList]
  let left = state.taCount
  let idx = 0

  mutations.addSeed(state, state.currSeed)

  while (idx <= total) {
    const count = Math.floor(remainder.length / left)

    lists = K.insert(lists.length - 1, K.take(count, shuffle(remainder, state.currSeed)), lists)
    remainder = K.drop(count, remainder)

    left--
    idx++
  }

  return lists
}

/**
 * @name clear
 * @description Clears out the children of the element given
 * @param {Element} el The element we want to clear
 * @return {Void}
 */
const clear = el => {
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}

const byVal = K.prop(['value'])

// Sometimes inputs stay put upon refresh, let's make sure those are given to our state
store.mutations.setSeed(store.state, byVal(document.getElementById('seed')))
store.mutations.setTACount(store.state, byVal(document.getElementById('taCount')))

// Build listener events to keep state up to date
document.getElementById('taCount').addEventListener('input', ({ target }) =>
  store.mutations.setTACount(store.state, target.value))

document.getElementById('seed').addEventListener('input', ({ target }) =>
  store.mutations.setSeed(store.state, target.value))

document.getElementById('runShuffle').addEventListener('click', () => {
  const listData = generateShuffledLists(store)
  const listEl = document.getElementById('studentLists')

  clear(listEl)

  listData.forEach((students, i) => {
    const stuEl = createStuList(i + 1, students)

    K.branch(
      K.compose(K.lt(4), K.length),
      () => stuEl.classList.add('namelist--partial'),
      K.branch(
        K.compose(K.lt(3), K.length),
        () => stuEl.classList.add('namelist--half'),
        K.identity
      ),
      listData
    )

    listEl.appendChild(stuEl)
  })
})
