'use client'
import { useState, useEffect, useRef } from "react";

// crete a type of choice
// type Choice = {
// 	desc: string,
// 	type: int,
// 	timestamp: int,
// };

// type Goal = {
// 	name: string,
// 	choices: Choice[],
// };

function IconDown(props) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="0.7em"
      width="1em"
      {...props}
    >
      <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
    </svg>
  );
}

function IconRight(props) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="0.7em"
      width="1em"
      {...props}
    >
      <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
    </svg>
  );
}

function IconDelete(props) {
	return (
		<svg fill="none" viewBox="0 0 24 24" height="1.2em" width="1.5m">
						<path
							fill="currentColor"
							fillRule="evenodd"
							d="M17 6V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1H4a1 1 0 000 2h1v11a3 3 0 003 3h8a3 3 0 003-3V8h1a1 1 0 100-2h-3zm-2-1H9v1h6V5zm2 3H7v11a1 1 0 001 1h8a1 1 0 001-1V8z"
							clipRule="evenodd"
						/>
		</svg>
	);
}

const Goal = ({ name, choices, onAddNewChoice, onDelete }) => {
	const [isNewChoiceInputVisible, setIsNewChoiceInputVisible] = useState(false);
	const [isChoicesVisible, setIsChoicesVisible] = useState(false);
	const [choiceType, setChoiceType] = useState(0);
  const newChoiceInputRef = useRef(null);

	const handleAddNewChoice = (choiceType) => {
		setChoiceType(choiceType);
    setIsNewChoiceInputVisible(true);
    newChoiceInputRef.current.focus();
  };

  return (
    <div className="flex flex-col gap-2 border border-black/500 shadow-lg rounded-lg p-2 ">
			<div className="flex items-center justify-between">
				<button className="w-full flex text-lg font-medium items-center gap-2"
					onClick={() => setIsChoicesVisible(!isChoicesVisible)}>
					{isChoicesVisible ? <IconDown /> : <IconRight />}
					<p>{name}</p>
				</button>
				{/* &#40;{choices.reduce((acc, obj) => acc + obj.type, 0)}&#47;{choices.length}&#41; */}
				<div className="flex gap-4 items-center mr-1">
					<button
					className="text-white bg-red-600 rounded-lg px-4 py-1"
						onClick={() => {
							handleAddNewChoice(0);
					}}>
					-
				</button>
				<button
						className="text-white bg-green-600 rounded-lg px-4 py-1"
						onClick={() => {
							handleAddNewChoice(1);
						}}>
					+
					</button>
					<button
						onClick={() => onDelete()}
						>
						<IconDelete />
					</button>
				</div>
			</div>
			<input ref={newChoiceInputRef} hidden={!isNewChoiceInputVisible} type="text" placeholder="Add new choice"
				className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 w-full border-b border-gray-300"
				onKeyDown={(e) => {
					console.log(e);
					if (e.key === 'Enter') {
						onAddNewChoice(e.target.value, choiceType, Date.now());
						e.target.value = '';
						setIsNewChoiceInputVisible(false);
					}
					}}
				/>
			<ol className="divide-y divide-gray-200" hidden={!isChoicesVisible}>
				{choices.length === 0 && (
					<li className="py-2 text-gray-500">No choices yet</li>
				)}
				{choices.toReversed().map((choice, choiceIndex) => (
					<li className={"py-2 " + (choice.type === 0 ? 'text-red-600' : 'text-green-600')}
						key={choiceIndex}>
						<div className="flex items-center justify-between">
							<p className="text-sm font-medium">{choice.desc}</p>
							<p>{choice.type === 0 ? "-" : "+"}</p>
						</div>
					</li>
				))}
			</ol>
    </div>
  );
};

export default function Home() {		
	const key = "scorecard";
	const [userInput, setUserInput] = useState('');
	const [goals, setGoals] = useState([ ]);
	
	useEffect(() => {
			const stored = localStorage.getItem(key);
			setGoals(stored ? JSON.parse(stored) : []);
	}, []);

	useEffect(() => {
			localStorage.setItem(key, JSON.stringify(goals));
	}, [goals]);
	
	const addGoal = (name) => {
		setGoals([...goals, { name, choices: [] }]);
	};
	
	const addChoice = (goalIndex, desc, type, timestamp) => {
		const newGoals = [...goals];
		newGoals[goalIndex].choices.push({ desc, type, timestamp });
		setGoals(newGoals);
	};
	
	const removeGoal = (goalIndex) => {
		const newGoals = [...goals];
		newGoals.splice(goalIndex, 1);
		setGoals(newGoals);
	};
	
  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen b-20 gap-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
				<h1 className="text-gray-800 font-bold text-3xl">The Scorecard</h1>
				<div className="max-w-md mx-auto overflow-hidden">
					<div className="w-full max-w-sm mx-auto flex items-center border border-black/500 shadow-lg rounded-lg px-2 py-2">
						<input
							className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
							onSubmit={(e) => { e.preventDefault(); addGoal(userInput); }}
							onChange={(e) => setUserInput(e.target.value)}
							type="text" placeholder="Add a goal"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									addGoal(userInput);
									setUserInput('');
									e.target.value = '';
								}
							}}>
							
									</input>
							<button
					className="flex-shrink-0 bg-black hover:bg-black border-black hover:border-black text-sm border-4 text-white py-1 px-2 rounded"
					onClick={() => addGoal(userInput)}
									type="button">
									Add
						</button>
					</div>
					<ul className="">
						{goals.map((goal, goalIndex) => (
							<li className="py-2" key={goalIndex}>
								<Goal name={goal.name}
									choices={goal.choices}
									onAddNewChoice={(desc, type, timestamp) => addChoice(goalIndex, desc, type, timestamp)}
									onDelete={() => removeGoal(goalIndex)}
								/>
								{/* {newChoiceIndex !== null && (
									<div>
										<input
											type="text"
											placeholder="Add new choice"
											onSubmit={(e) => {
												handleSaveNewChoice(e.target.value);
												e.target.value = '';
											}}
										/>
									</div>
								)} */}
							</li>					
						))}
					</ul>
				</div>	
				{/* {JSON.stringify(goals)} */}
      </main>
    </div>
  );
}
