import React from 'react';
import App, {
	storiesReducer,
	Item,
	List,
	SearchForm,
	InputWithLabel,
} from './App';

import {
  render,
  screen,
  fireEvent,
  act,
} from '@testing-library/react';

import axios from 'axios';

jest.mock('axios');

//test('renders learn react link', () => {
//  const { getByText } = render(<App />);
//  const linkElement = getByText(/learn react/i);
//  expect(linkElement).toBeInTheDocument();
//});

describe('something thruthy and falsy', () => {
	it('true to be true', ()=> {
		expect(true).toBe(true);
	});

	it('false to be false', ()=> {
		expect(false).toBe(false);
	});	
});

test('false to be false', () => {
	expect(false).toBe(false);
});

describe('App component', () => {
	test('removes an item when clicking the Dismiss button', () => {

	});

	test('requests some initial stories from an API', () => {

	});
});

describe('something truthy and falsy', () => {
	test('true to be true', () => {
		expect(true).toBeTruthy();
	});

	test('false to be false', () => {
		expect(false).toBeFalsy();
	});
});

const storyOne = {
	title: 'React',
	url: 'https://reactjs.org/',
	author: 'Jordan Walke',
	num_comments: 3,
	points: 4,
	objectID: 0,
};

const storyTwo = {
	title: 'Redux',
	url: 'https://redux.js.org/',
	author: 'Dan Abramov, Andrew Clark',
	num_comments: 2,
	points: 5,
	objectID: 1,
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
	test('removes a story from all stories', () => {
		const action = { type: 'REMOVE_STORY', payload: storyOne};
		const state = { data: stories, isLoading: false, isError: false};

		const newState = storiesReducer(state, action);

		const expectedState = {
			data: [storyTwo],
			isLoading: false,
			isError: false,
		};
		expect(newState).toStrictEqual(expectedState);
	});
});

describe('storiesReducer', () => {
	test('stories failed to fetch', () => {
		const action = { type: 'STORIES_FETCH_FAILURE'};
		const state = { data: stories, isLoading: false, isError: true};

		const newState = storiesReducer(state, action);

		const expectedState = {
			data: [storyOne, storyTwo],
			isLoading: false,
			isError: true,
		};
		expect(newState).toEqual(expectedState);
	});
});

describe('storiesReducer', () => {
	test('stories fetch success', () => {
		const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories};
		const state = { data: stories, isLoading: false, isError: false};

		const newState = storiesReducer(state, action);

		const expectedState = {
			data: [storyOne, storyTwo],
			isLoading: false,
			isError: false,
		};
		expect(newState).toEqual(expectedState);
	});
});

describe('storiesReducer', () => {
	test('stories fetch init', () => {
		const action = { type: 'STORIES_FETCH_INIT'};
		const state = { data: stories, isLoading: true, isError: false};

		const newState = storiesReducer(state, action);

		const expectedState = {
			data: [storyOne, storyTwo],
			isLoading: true,
			isError: false,
		};
		expect(newState).toEqual(expectedState);
	});
});

// Testing the Item component, assert whether it renders expected HTML out from given props.
describe('Item', () => {
	test('renders all properties', () => {
		render(<Item item={storyOne} />);

		expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
		expect(screen.getByText('React')).toHaveAttribute(
			'href',
			'https://reactjs.org/'
			);

		screen.debug();
	});

	test('renders a clickable dismiss button', () => {
		render(<Item item={storyOne} />);

		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	test('clicking the dismiss button calls the callback handler', () => {
		const handleRemoveItem = jest.fn();

		render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

		fireEvent.click(screen.getByRole('button'));

		expect(handleRemoveItem).toHaveBeenCalledTimes(1);
	});
});

//Testing the InPutWithLabel component that's a part of SearchForm
describe('SearchForm', () => {
	const searchFormProps = {
		searchTerm: 'React',
		onSearchInput: jest.fn(),
		onSearchSubmit: jest.fn(),
	};

	test('renders the input field with its value', () => {
		render(<SearchForm {...searchFormProps} />);

		expect(screen.getByDisplayValue('React')).toBeInTheDocument();
	});

	test('renders the correct label', () => {
		render(<SearchForm {...searchFormProps} />);

		expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
	});

	test('calls onSearchInput on input field change', () => {
		render(<SearchForm {...searchFormProps} />);

		fireEvent.change(screen.getByDisplayValue('React'), {
			target: { value: 'Redux' },
		});

		expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
	});

	test('calls onSearchSubmit on button submit click', () => {
		render(<SearchForm {...searchFormProps} />);

		fireEvent.submit(screen.getByRole('button'));

		expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
	});

	//Snapshot testing
	
	test('renders snapshot of SearchForm', () => {
		const { container } = render(<SearchForm {...searchFormProps} />);
		expect(container.firstChild).toMatchSnapshot();
	});

});


//Testing list component
describe('List', () => {
	const listProps = {
		list: stories,
		onRemoveItem: jest.fn(),
	};

	test('renders the list', () => {
		render(<List {...listProps} />);

		expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
		expect(screen.getByText('React')).toHaveAttribute(
			'href',
			'https://reactjs.org/'
		);
		//screen.debug();
	});

	test('renders snapshot of List', () => {
		const { container } = render(<List {...listProps} />);
		expect(container.firstChild).toMatchSnapshot();
	});

});

//Testing InputWithLabel component
/*
describe('InputWithLabel', () => {
	const labelProps = {
	  id: 1,
	  value: 'value',
	  type: 'text',
	  onInputChange: jest.fn(),
	  isFocused: true,
	};

	test('renders the InputWithLabel', () => {
		render(<InputWithLabel {...labelProps} />);

		expect(screen.getByText("")).toBeInTheDocument();
	});
});
*/


//Integration Testing App Component
describe('App', () => {
	test('succeeds fetching data', async () => {
		const promise = Promise.resolve({
			data: {
				hits: stories,
			},
		});

		axios.get.mockImplementationOnce(() => promise);

		render(<App />);

		expect(screen.queryByText(/Loading/)).toBeInTheDocument();

		await act(() => promise);

		expect(screen.queryByText(/Loading/)).toBeNull();

		expect(screen.getByText('React')).toBeInTheDocument();
		expect(screen.getByText('Redux')).toBeInTheDocument();
		expect(screen.getAllByText('Dismiss').length).toBe(2);
	});

	test('fails fetching data', async () => {
		const promise = Promise.reject();

		axios.get.mockImplementationOnce(() => promise);

		render(<App />);

		expect(screen.getByText(/Loading/)).toBeInTheDocument();

		try {
			await act(() => promise);
		} catch (error) {
			expect(screen.queryByText(/Loading/)).toBeNull();
			expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
		}
	});

	test('removes a story', async () => {
		const promise = Promise.resolve({
			data: {
				hits: stories,
			},
		});

		axios.get.mockImplementationOnce(() => promise);

		render(<App />);

		await act(() => promise);

		expect(screen.getAllByText('Dismiss').length).toBe(2);
		expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

		fireEvent.click(screen.getAllByText('Dismiss')[0]);

		expect(screen.getAllByText('Dismiss').length).toBe(1);
		expect(screen.queryByText('Jordan Walke')).toBeNull();
	});

	test('searches for specific stories', async () => {
		const reactPromise = Promise.resolve({
			data: {
				hits: stories,
			}
		});

		const anotherStory = {
			title: 'Javascript',
			url: 'https://en.wikipedia.org/wiki/JavaScript',
			author: 'Brendan Eich',
			num_comments: 15,
			points: 10,
			objectId: 3,
		};

		const javascriptPromise = Promise.resolve({
			data: {
				hits: [anotherStory],
			},
		});

		axios.get.mockImplementation(url => {
			if (url.includes('React')) {
				return reactPromise;
			}
			if (url.includes('JavaScript')) {
				return javascriptPromise;
			}

			throw Error();
		});

		// Initial Render

		render(<App />);

		//First Data Fetching

		await act(() => reactPromise);

		expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
		expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

		expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();

		expect(
				screen.queryByText('Dan Abramov, Andrew Clark')
			).toBeInTheDocument();
		expect(screen.queryByText('Brendan Eich')).toBeNull();

		//User Interaction -> Search

		fireEvent.change(screen.queryByDisplayValue('React'), {
			target: {
				value: 'JavaScript',
			}
		});

		expect(screen.queryByDisplayValue('React')).toBeNull();
		expect(
			screen.queryByDisplayValue('JavaScript')
			).toBeInTheDocument();

		fireEvent.submit(screen.queryByText('Submit'));

		// Second Data Fetching

		await act(() => javascriptPromise);

		expect(screen.queryByText('Jordan Walke')).toBeNull();
		expect(
			screen.queryByText('Dan Ambramov, Andrew Clark')
			).toBeNull();
		expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();

	});

	// This test is creating warnings
	test('renders snapshot of App', () => {
		const { container } = render(<App />);
		expect(container.firstChild).toMatchSnapshot();
	});

});

