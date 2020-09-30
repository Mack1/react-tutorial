import React from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';


const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, (newValue: string) => void] => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );
  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);
  return [value, setValue];
};


type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Array<Story>;

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
}

interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
}

interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
}

interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};
const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );
  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    try {
      const result = await axios.get(url);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' });
    }
  }, [url]);
  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);


  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };


  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };


  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);

    event.preventDefault();
  };
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />
      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}: SearchFormProps) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>
    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};

const InputWithLabel = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}: InputWithLabelProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

type list = {
  list: Array<object>;
};

type sort = { sort: object };

const SORTS:any = {
  NONE: ({ list }: list) => list,
  TITLE: ({ list }: list) => sortBy(list, 'title'),
  AUTHOR: ({ list }: list) => sortBy(list, 'author'),
  COMMENT: ({ list }: list) => sortBy(list, 'num_comments').reverse(),
  POINT: ({ list }: list) => sortBy(list, 'points').reverse(),
};

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

type ItemProps = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
  item: Story;
  onRemoveItem: (item: Story) => void;
};

const List = ({ list, onRemoveItem }: ListProps) => {
  const [sort, setSort] = React.useState('NONE');

  type KeyProps = {
    sortKey: string;
  };

  const handleSort = ({ sortKey }: KeyProps) => {
    setSort(sortKey); 
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <span style={{ width: '40%' }}>
          <button type="button" onClick={() => handleSort({ sortKey: 'TITLE' })}>
            Title
          </button>
        </span>
        <span style={{ width: '30%' }}>Author</span>
          <button type="button" onClick={() => handleSort({ sortKey: 'AUTHOR' })}>
            Author
          </button>
        <span style={{ width: '10%' }}>Comments</span>
          <button type="button" onClick={() => handleSort({ sortKey: 'COMMENT' })}>
            Comments
          </button>
        <span style={{ width: '10%' }}>Points</span>
          <button type="button" onClick={() => handleSort({ sortKey: 'POINT' })}>
            Points
          </button>
        <span style={{ width: '10%' }}>Actions</span>
      </div>

      {sortedList.map( (item: ItemProps) => (
        <Item
          key={item.objectID}
          item={item}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
   );
};

const Item = ({ Story, onRemoveItem }: ItemProps) => (
  <div style={{ display: 'flex'}}>
    <span style={{ width: '40%'}}>
      <a href={Story.url}>{Story.title}</a>
    </span>
    <span style={{ width: '30%'}}>{Story.author}</span>
    <span style={{ width: '10%'}}>{Story.num_comments}</span>
    <span style={{ width: '10%'}}>{Story.points}</span>
    <span style={{ width: '10%'}}>
      <button type="button" onClick={() => onRemoveItem(Story)}>
        Dismiss
      </button>
    </span>
  </div>
);
export default App;

export { storiesReducer, SearchForm, InputWithLabel, List, Item };