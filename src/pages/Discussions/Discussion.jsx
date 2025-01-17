import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../components/auth/auth-context'
import api from '@/api/api'

function Discussion() {
  const [question, setQuestion] = useState(null);
  const [answerInput, setAnswerInput] = useState('');
  const [answers, setAnswers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { discussionId } = useParams();
  const { authStatus } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.fromLink) {
      // Increment the post view count
      const incrementViewCount = async () => {
        try {
          let userId = null;
          if(authStatus.authStatus) {
            userId = authStatus.user.userId;
          }
          const res = await api.put(`/discussion/increment-views/${discussionId}`, { userId });
          if (res.data.status !== "success") {
            alert("Error incrementing view count");
          }
        } catch (error) {
          alert("Error incrementing view count");
        }
      };
      incrementViewCount();

      // Clear state to avoid increasing view count on reload
      window.history.replaceState(
        {},
        document.title,
        navigate(location.pathname)
      );
    }

    const fetchQuestion = async () => {
      try {
        if(!authStatus.authStatus) {
          const response = await api.get(`/discussion/get-discussion-author/${discussionId}`);
          setQuestion(response.data.data);
        }else{
          const accessToken = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');

          const response = await api.get(`/discussion/get-discussion-ud-author/${discussionId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'x-refresh-token': refreshToken,
            }
          })

          setQuestion(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    const fetchAnswers = async () => {
      try {
        const response = await api.get(`/discussion/get-answers-user/${discussionId}`)
        setAnswers(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchQuestion();
    fetchAnswers();
  }, [])

  const handleSendAnswer = async () => {
    if(!authStatus.authStatus) {
      alert('You must login first');
      return
    }

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      const response = await api.post('/discussion/create-answer', {
        answerTo: question.discussion.discussionId,
        content: answerInput,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken,
        }
      })

      // Reset answer input state
      setAnswerInput('');

      // Update answers state
      setAnswers((prevAnswers) => {
        return [response.data.data.newAnswer, ...prevAnswers];
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleVote = async (voteType, curUserVote) => {
    // Check auth status
    if (!authStatus.authStatus) {
      alert("You need to be login to vote");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    let vote;
    let votesIncrement;
    if (curUserVote == 1) {
      vote = voteType == "up" ? 0 : -1;
      votesIncrement = voteType == "up" ? -1 : -2;
    } else if (curUserVote == 0) {
      vote = voteType == "up" ? 1 : -1;
      votesIncrement = voteType == "up" ? 1 : -1;
    } else if (curUserVote == -1) {
      vote = voteType == "up" ? 1 : 0;
      votesIncrement = voteType == "up" ? 2 : 1;
    }

    try {
      const res = await api.put(`discussion/votes/${discussionId}`,
                      { vote },
                      {
                        headers: {
                          Authorization: `Bearer ${accessToken}`,
                          "x-refresh-token": refreshToken,
                        },
                    });

      // update discussion state
      setQuestion((prevQuestion) => {
        const updatedQuestion = { ...prevQuestion };
        updatedQuestion.discussion.votes += votesIncrement;
        updatedQuestion.userDiscussion.userVote = vote;
        return updatedQuestion;
      });

    } catch (error) {
      alert("Error voting");
    }
  };

  const handleDelete = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      const res = await api.delete(`/discussion/delete/${discussionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-refresh-token': refreshToken,
        }
      });

      if(res.data.status === 'success') {
        alert("Discussion deleted successfully");
        navigate('/discussions');
      }else{
        alert('Error deleting discussion');
      }
    } catch (error) {
      alert('Error deleting discussion');
    }
  }


  if(!question) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
        <div className="w-full bg-gray-300 mb-2 p-2 rounded-md">
            <h1 className="text-xl font-bold">Question :</h1>
            <p>Title : {question.discussion.title}</p>
            <p>Content : {question.discussion.content}</p>
            <p>UserId : {question.discussion.userId}</p>
            <p>DiscussionId : {question.discussion.discussionId}</p>
            <p>Views : {question.discussion.views}</p>
            <p>Votes : {question.discussion.votes}</p>
            <p>Created At : {question.discussion.createdAt}</p>
            <p>Updated At : {question.discussion.updatedAt}</p>

            <h1 className="text-xl font-bold mt-2">Author :</h1>
            <p>UserId : {question.author.userId}</p>
            <p>Name : <Link to={`/users/${question.author.userId}`} className="text-blue-500 underline">{question.author.name}</Link></p>

            <h1 className="text-xl font-bold mt-2">Hashtags :</h1>
            <div className='flex *:mr-2 '>
              {
                question.hashtags?.map((hashtag) => (
                  <p key={hashtag}>#{hashtag}</p>
                ))
              }
            </div>

            <div className="flex w-1/4 mt-3 justify-between items-center">
              <button
                onClick={() => handleVote("up", question.userDiscussion?.userVote)}
                className={`px-2 py-1 rounded-md border border-black ${question.userDiscussion?.userVote === 1 ? "bg-gray-500" : "bg-gray-300"}`}
              >
                Up Vote
              </button>
              <span className="text-lg">{question.discussion.votes}</span>
              <button
                onClick={() => handleVote("down", question.userDiscussion?.userVote)}
                className={`px-2 py-1 rounded-md border border-black ${question.userDiscussion?.userVote === -1 ? "bg-gray-500" : "bg-gray-300"}`}
              >
                Down Vote
              </button>
            </div>

            {/* Delete button */}
            {
              question.author.userId === authStatus.user?.userId && 
            <>
              <Link to={`/discussions/edit/${question.discussion.discussionId}`} className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2 mr-2">Edit Discussion
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-2 py-1 rounded-md mt-2"
              >Delete Discussion
              </button>
            </>
            }
        </div>


        {/* input for answering the question */}
        <div className="flex items-center">
          <input
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            type="text"
            placeholder="Jawab di sini, bang"
            className="border border-black mt-2 mb-1 rounded-md px-2 py-1 w-full"
          />
          <button
            onClick={() => handleSendAnswer(null)}
            className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2"
          >
            Send
          </button>
        </div>

        {/* Answers section */}
        <div>
          {
            answers.map((answer) => (
              <div key={answer.discussionId} className="w-full bg-gray-300 mb-2 p-2 rounded-md">
                <p>UserId : {answer.userId}</p>
                <p>Username : {answer.name}</p>
                <p>Content : {answer.content}</p>
                <p>DiscussionId : {answer.discussionId}</p>
                <p>Votes : {answer.votes}</p>
                <p>Created At : {answer.createdAt}</p>
                <p>Updated At : {answer.updatedAt}</p>
              </div>
            ))
          }
        </div>
    </div>
  )
}

export default Discussion