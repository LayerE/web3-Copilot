import axios from "axios";
import { toast } from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { nanoid } from "nanoid";
import { models } from "@/components/GPTModelDropDown";
import { Session } from "inspector";
export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export const BE_URL = "https://layere-copilot.up.railway.app";

export interface Prompt {
  id?: number | string;
  mssgId?: number | string;
  title: string;
  content?: string;
  streaming?: boolean;
  mintBody?: any;
  sources?: any;
  isAllCreditsUsed?: boolean;
  feedback?: any;
  suggestions?: any;
  abortPrompt?: boolean;
  fullContentLoaded?: boolean;
  noCitationsFound?: boolean;
  noSuggestionsFound?: boolean;
  type?: "stats" | "learn" | "mint" | "faucet" | "tokens";
  isContractReady?: boolean;
  sourceCode?: any;
  txData?: any;
  regeneratedResponses?: string[];
  isMintReady?: boolean;
  loader_queries?: [];
  loader_links?: [];
}
export type Task = {
  id: string;
  title: string;
  content?: string | null;
  streamingTask?: boolean;
};
export interface Goal {
  id: number | string;
  title: string;
  tasks: Task[] | [];
  streamingGoal?: boolean;
}
const DEFAULT_TOPIC = "New conversation";
export type PERSONA_TYPES = "new_dev" | "dev" | "validator";
export type SERVICE_TYPES = "copilot" | "agent_gpt";
export interface ChatSession {
  id: string;
  conversation_id?: number | string;
  topic: string;
  prompts: Prompt[];
  goals: Goal[];
  mintHistoryResponse?: any[];
  lastUpdate: string;
  type: PERSONA_TYPES;
  service: SERVICE_TYPES;
  latestPromptContent?: string;
  isContractDeployment?: boolean;
  isMintReady?: boolean;
  isFvrt?: boolean;
  continuedSessionID?: any;
}
function createEmptySession(
  idx?: number | null,
  _service?: SERVICE_TYPES
): ChatSession {
  const createDate = new Date().toLocaleString();
  return {
    id: nanoid(),
    topic: idx ? `${DEFAULT_TOPIC} - ${idx}` : DEFAULT_TOPIC,
    prompts: [],
    goals: [],
    lastUpdate: createDate,
    mintHistoryResponse: [],
    type: "new_dev",
    service: _service ?? "copilot",
    isContractDeployment: false,
    isMintReady: false,
  };
}

interface ChatStore {
  gptModel: any;
  hasSiteAccess: boolean;
  api_key: string;
  sessions: ChatSession[];
  credits: number;
  creditStatus: boolean;
  user: any;
  currentSessionID: string | null;
  isLoggedIn: boolean;
  jwt: string;
  showSources: boolean;
  addSessionGoal: (goal_title: string, session_id: string) => void;
  responseAgentTask: (task: Task, goal: Goal) => void;
  continueSession: (conversationID: string) => void;
  likeSession: (sessionID: any, liked: boolean) => void;
  setGPTModel: (model: any) => void;
  updateSessionType: (type: PERSONA_TYPES) => void;
  likePrompt: (prompt: Prompt, liked: boolean) => void;
  clearSessions: () => void;
  updateUserInfo: () => void;
  updateJWT: (jwt: string) => void;
  updateLoginStatus: (status: boolean) => void;
  removeSession: (sessionID: string, sessionType: SERVICE_TYPES) => void;
  selectSession: (sessionID: string) => void;
  onNewPrompt: (prompt: Prompt) => void;
  onRegeneratePrompt: (promptID: string) => void;
  updateCurrentSession: (updater: (session: ChatSession) => void) => void;
  newSession: (_service?: SERVICE_TYPES) => void;
  updateAPIKey: (key: string) => void;
  updateCreditCount: (count?: number) => void;
  updateCreditStatus: (status: boolean) => void;
  addMintHistory: (mintRes: any) => void;
  removeMintHistory: (index: boolean) => void;
  currentSession: (sessionID?: string) => ChatSession;
  mintPrompt: (prompt: Prompt) => void;
  updateHideSourceStatus: (status: boolean) => void;
  responsePrompt: (prompt: Prompt, url: string, sessionID: string) => void;
  abortPrompt: (prompt: Prompt) => void;
  updateSiteAccessStatus: (giveAccess: boolean) => void;
  updateSessionData: (
    sessionID: string,
    updater: (session: ChatSession) => void
  ) => void;
}
const reduceCredits = (message: string) => {
  let credits = message?.length;
  if (credits < 200) {
    return 1;
  } else if (credits < 500) {
    return 2;
  } else if (credits < 1000) {
    return 3;
  } else {
    return 4;
  }
};

export const APP_KEY = "chat-store";

export const useChatStore = create<ChatStore>()(
  //@ts-ignore
  persist(
    //@ts-nocheck
    // @ts-ignore
    (set, get) => ({
      gptModel: models[1],
      sessions: [createEmptySession(), createEmptySession(null, "agent_gpt")],
      currentSessionID: null,
      api_key: "",
      credits: 1,
      hasSiteAccess: false,
      creditStatus: true,
      jwt: "",
      user: {},
      isLoggedIn: false,
      showSources: true,
      setGPTModel: (model: any) => {
        set({
          gptModel: model,
        });
      },
      addSessionGoal: async (goal_title: string, session_id: string) => {
        try {
          const res = await axios.post(BE_URL + "/agent/task", {
            goal: goal_title,
            name: nanoid(),
          });
          if (res.status === 200) {
            const sessions = get().sessions;
            let session = sessions.find((session) => session.id === session_id);
            //if session exists
            if (session) {
              let updatedSession = { ...session };
              let tasks = res.data.tasks.map(
                (task: string) =>
                ({
                  id: nanoid(),
                  title: task,
                  content: null,
                  streamingTask: false,
                } as Task)
              );
              if (tasks.length > 0) {
                let goal: Goal = {
                  id: res.data.id,
                  title: goal_title,
                  tasks: tasks,
                  streamingGoal: true,
                };
                updatedSession.goals.push(goal);
                Object.assign(session, updatedSession);
                set(() => ({ sessions }));
                for (const task of goal.tasks) {
                  await get().responseAgentTask(task, goal);
                }
                //all tasks fetched
                console.log("all tasks fetched");
                get().updateCurrentSession((session) => {
                  let currentGoal = session.goals.find(
                    (_goal) => _goal.id === goal.id
                  );
                  if (currentGoal) currentGoal.streamingGoal = false;
                });
              }
            }
          }
        } catch (err) {
          console.log("Error adding session:", err);
        }
      },
      updateAPIKey: (key: string) => {
        set({
          api_key: key,
        });
      },
      updateSiteAccessStatus: (giveAccess: boolean) => {
        set((state) => {
          return {
            hasSiteAccess: giveAccess,
          };
        });
      },
      updateHideSourceStatus(status: boolean) {
        set((state) => {
          return {
            showSources: status,
          };
        });
      },
      async continueSession(conversationID: string) {
        try {
          const res = await axios.post(BE_URL + "/conversation/id", {
            conversationId: conversationID,
          });
          const combinedRes = res?.data?.conversation?.chats?.questions?.map(
            (item: any, index: number) => ({
              title: item,
              content: res?.data?.conversation?.chats?.answers[index],
              id: nanoid(),
              type: "learn",
              regeneratedResponses: [],
            })
          );
          const createDate = new Date().toLocaleString();
          const new_session = {
            id: nanoid(),
            continuedSessionID: conversationID,
            topic: `${combinedRes[0]?.title}`,
            prompts: combinedRes,
            lastUpdate: createDate,
            type: "new_dev",
            isContractDeployment: false,
            isMintReady: false,
          };

          set((state) => ({
            currentSessionID: null,
            sessions: [new_session as ChatSession].concat(state.sessions),
            mintHistoryResponse: [],
          }));
        } catch (err) {
          console.log("err fetch convo", err);
        }
      },
      async updateUserInfo() {
        if (get().jwt !== "" && get().isLoggedIn) {
          try {
            const res = await axios.get(BE_URL + "/user/status", {
              headers: {
                authorization: get().jwt ?? null,
              },
            });
            set({
              user: { ...res.data },
              credits: res.data.tokens ?? 0,
            });
          } catch (error) {
            return error;
          }
        }
      },
      abortPrompt(prompt) {
        get().updateCurrentSession((session) => {
          session.lastUpdate = new Date().toLocaleString();
          session.prompts.map((_prompt) => {
            if (_prompt.id === prompt.id) {
              prompt.abortPrompt = true;
              prompt.streaming = false;
            }
            return _prompt;
          });
        });
      },
      updateSessionData(sessionID, updater) {
        const sessions = get().sessions;
        const session = sessions.filter(
          (session) => session.id === sessionID
        )[0];
        updater(session);
        set(() => ({ sessions }));
      },
      likeSession: (sessionID: any, liked: boolean) => {
        get().updateSessionData(sessionID, (session) => {
          session.lastUpdate = new Date().toLocaleString();
          session.isFvrt = liked;
        });
      },
      updateJWT(jwt: string) {
        set({
          jwt: jwt,
        });
      },
      updateLoginStatus(status: boolean) {
        set({
          isLoggedIn: status,
        });
      },
      clearSessions() {
        set((state) => ({
          sessions: [createEmptySession()],
          currentSessionID: state.sessions[0].id,
        }));
      },
      updateCreditCount(count?: number) {
        set((state) => {
          return {
            credits: count ?? state.credits - 1,
          };
        });
      },
      updateCreditStatus(status: boolean) {
        set({
          creditStatus: status,
        });
      },
      addMintHistory(mintRes: string) {
        get().updateCurrentSession((session) => {
          session.lastUpdate = new Date().toLocaleString();
          session?.mintHistoryResponse?.push(mintRes);
        });
      },
      removeMintHistory() {
        get().updateCurrentSession((session) => {
          console.log("remove mint history");
          session.mintHistoryResponse = [];
        });
      },
      selectSession(sessionID: string) {
        set({
          currentSessionID: sessionID,
        });
      },
      currentSession(sessionID?: string) {
        const session = get().sessions.find(
          (session) => session.id === get().currentSessionID
        );
        return session ?? get().sessions[0];
      },
      removeSession(sessionID: string, sessionType: SERVICE_TYPES) {
        const sessions = get().sessions.filter(
          (session) => session.id !== sessionID
        );
        let updatedObj: any = {};
        if (sessionType === "agent_gpt") {
          if (
            sessions.filter((session) => session.service === "agent_gpt")
              .length === 0
          ) {
            const new_agent_session = createEmptySession(null, "agent_gpt");
            updatedObj = {
              sessions: [...sessions, new_agent_session],
              currentSessionID: new_agent_session.id,
            };
          } else {
            let lastAgentSessionIdx: number = sessions.findLastIndex(
              (session) => session.service === "agent_gpt"
            );
            updatedObj = {
              sessions,
              currentSessionID: sessions[lastAgentSessionIdx].id,
            };
          }
        } else if (sessionType === "copilot") {
          if (
            sessions.filter((session) => session.service === "copilot")
              .length === 0
          ) {
            const new_copilot_session = createEmptySession(null, "copilot");
            updatedObj = {
              sessions: [...sessions, new_copilot_session],
              currentSessionID: new_copilot_session.id,
            };
          } else {
            let lastCopilotSessionIdx: number = sessions.findLastIndex(
              (session) => session.service === "copilot"
            );
            updatedObj = {
              sessions,
              currentSessionID: sessions[lastCopilotSessionIdx].id,
            };
          }
        }
        set({
          ...updatedObj,
        });
        // get().selectSession(updatedObj.currentSessionID);
      },
      newSession(_service?: SERVICE_TYPES) {
        const newSession = createEmptySession(
          get().sessions.length,
          _service ?? "copilot"
        );
        set((state) => ({
          sessions: [newSession].concat(state.sessions),
          currentSessionID: newSession.id,
          mintHistoryResponse: [],
        }));
      },
      updateCurrentSession(updater) {
        const sessions = get().sessions;
        const session = get().sessions.find(
          (session) => session.id === get().currentSessionID
        );
        if (session) updater(session);
        set(() => ({ sessions }));
      },
      updateSessionType(type: PERSONA_TYPES) {
        get().updateCurrentSession((session) => {
          session.type = type;
        });
      },
      mintPrompt: async (prompt) => {
        get().addMintHistory({ role: "user", content: prompt.title });
        try {
          const res = await fetch(`${BE_URL}/mintgpt`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: get().jwt ?? null,
              apikey: get().api_key ?? null,
            },
            body: JSON.stringify({
              message: prompt.title,
              history: get()?.currentSession().mintHistoryResponse,
            }),
          });

          const data = await res.json();
          if (data) {
            prompt.id = new Date().getTime().toLocaleString();
            prompt.streaming = false;
            prompt.content = data.response;
            get().addMintHistory({
              role: "assistant",
              content: data.response,
            });
            prompt.mintBody = data.body;
            prompt.isAllCreditsUsed = data.isAllCreditsUser; //typo at the BE! suppose to be data.isAllCreditUsed
            if (get().isLoggedIn) get().updateUserInfo();
            else {
              if (prompt.isAllCreditsUsed) {
                get().updateCreditCount(0);
              } else {
                let updateCount = 1;
                get().updateCreditCount(updateCount < 1 ? 0 : updateCount);
              }
            }
            get().updateCurrentSession((session) => {
              session.lastUpdate = new Date().toLocaleString();
              session.prompts.map((_prompt) => {
                if (_prompt.id === prompt.id) {
                  if (_prompt.type === "mint") {
                    _prompt.mintBody = data.body;
                  }
                  _prompt.content = prompt.content;
                }
                return _prompt;
              });
            });
          }
        } catch (error) {
          return error;
        } finally {
          prompt.streaming = false;
        }
      },
      responsePrompt: async (prompt, url, sessionID) => {
        prompt.streaming = true;
        // const { abortCurrentPrompt } = useAppState();
        let history = get()
          .currentSession()
          ?.prompts?.map((prompt) => {
            return prompt.title;
          });
        const ctrl = new AbortController();
        const session_type = get().currentSession()?.type;
        try {
          let dataEvent: any = [];
          fetchEventSource(`${BE_URL}/${url}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: get().jwt ?? null,
              "api-key": get().api_key ?? null,
            },
            body: JSON.stringify({
              message: prompt.title,
              persona: session_type,
              history: history,
              conversationId: get().currentSession()?.conversation_id ?? null,
              answer: get().currentSession()?.latestPromptContent ?? null,
              contract: get().currentSession()?.isContractDeployment ?? false,
              isFooter: get().showSources.toString() ?? null,
              model: get().gptModel ?? null,
              isRegenerated: prompt?.regeneratedResponses?.length! > 0 ?? false,
            }),
            signal: ctrl.signal,
            openWhenHidden: true,
            async onopen(response) {
              if (response.status === 429) {
                toast.error("All credits used up!");
                prompt.streaming = false;
                get().updateCreditStatus(false);
                get().updateCreditCount(0);
                prompt.content =
                  get().isLoggedIn && get().jwt !== ""
                    ? "All credits used up! Come back tomorrow for more credits."
                    : "You have no credits left. Please Connect your wallet to get more credits.";
                get().updateCurrentSession((session) => {
                  session.lastUpdate = new Date().toLocaleString();
                  session.prompts.map((_prompt) => {
                    if (_prompt.id === prompt.id) {
                      _prompt.content =
                        get().isLoggedIn && get().jwt !== ""
                          ? "All credits used up! Come back tomorrow for more credits."
                          : "You have no credits left. Please Connect your wallet to get more credits.";
                      _prompt.streaming = false;
                    }
                    return _prompt;
                  });
                });
                throw new Error("All credits used up!");
              }
            },
            onmessage: (event) => {
              if (prompt?.abortPrompt) {
                ctrl.abort();
                console.log("Connection aborted!");
              }
              const data = JSON.parse(event.data);
              prompt.id = new Date().getTime().toLocaleString();
              prompt.isAllCreditsUsed = data.isAllCreditsUsed; //typo at the BE! suppose to be data.isAllCreditUsed

              if (data?.data?.completed) {
                prompt.fullContentLoaded = true;
              }
              if (data?.data?.queries) {
                get().updateCurrentSession((session) => {
                  session.lastUpdate = new Date().toLocaleString();
                  session.prompts?.map((_prompt) => {
                    if (_prompt.id === prompt.id) {
                      _prompt.loader_queries = data?.data?.queries;
                    }
                  });
                });
              }

              if (data?.data?.links) {
                get().updateCurrentSession((session) => {
                  session.lastUpdate = new Date().toLocaleString();
                  session.prompts?.map((_prompt) => {
                    if (_prompt.id === prompt.id) {
                      _prompt.loader_links = data?.data?.links;
                    }
                  });
                });
              }

              if (data?.data?.id !== undefined) {
                if (get().isLoggedIn) get().updateUserInfo();
                else get().updateCreditCount();
              }
              if (data?.data?.conversationId !== undefined) {
                get().updateSessionData(sessionID, (session) => {
                  session.lastUpdate = new Date().toLocaleString();
                  session.conversation_id = data?.data?.conversationId;
                });
              }
              if (data?.data?.type === "contract") {
                get().updateCurrentSession((session) => {
                  session.lastUpdate = new Date().toLocaleString();
                  session.isContractDeployment = true;
                });
              }
              if (prompt.isAllCreditsUsed) {
                get().updateCreditCount(0);
                prompt.streaming = false;
                get().updateCurrentSession((session) => {
                  session.lastUpdate = new Date().toLocaleString();
                  session.prompts.map((_prompt) => {
                    if (_prompt.id === prompt.id) {
                      _prompt.streaming = false;
                    }
                    return _prompt;
                  });
                });
              } else {
                data?.data?.id ||
                  data?.data?.completed ||
                  data?.data?.conversationId ||
                  data?.data?.type ||
                  data?.data?.queries ||
                  data?.data?.links
                  ? dataEvent.push("")
                  : dataEvent.push(data?.data);
                prompt.content = dataEvent.join("");
                get().updateCurrentSession((session) => {
                  session.lastUpdate = new Date().toLocaleString();
                  session.prompts.map((_prompt) => {
                    if (_prompt.id === prompt.id) {
                      _prompt.content = prompt.content;
                    }
                    return _prompt;
                  });
                });
                if (data.suggestions) {
                  prompt.mssgId = data.id;
                  if (data?.source?.length > 0) {
                    prompt.sources = data.source;
                  } else {
                    prompt.noCitationsFound = true;
                  }
                  if (data?.suggestions?.length > 0) {
                    prompt.suggestions = data.suggestions;
                  } else {
                    prompt.noSuggestionsFound = true;
                  }
                  get().updateSessionData(sessionID, (session) => {
                    session.lastUpdate = new Date().toLocaleString();
                    session.prompts.map((_prompt) => {
                      if (_prompt.id === prompt.id) {
                        _prompt.sources = [].concat(prompt?.sources);
                        _prompt.suggestions = prompt.suggestions;
                        _prompt.mssgId = prompt.mssgId;
                      }
                      return _prompt;
                    });
                  });
                }
                if (data?.conversationId) {
                  if (url === "stats") {
                    if (get().currentSession().prompts.length === 1) {
                      prompt.content +=
                        "\n\n using **[surfaceboard.xyz](https://surfaceboard.xyz)** plugin\n";
                    }
                  }
                  get().updateSessionData(sessionID, (session) => {
                    session.lastUpdate = new Date().toLocaleString();
                    session.conversation_id = data?.conversationId;
                    session.latestPromptContent = prompt.content;
                  });
                }
                if (data.showButton) {
                  if (url === "mint") {
                    prompt.isMintReady = true;
                  } else {
                    prompt.isContractReady = true;
                  }
                  get().updateCurrentSession((session) => {
                    session.lastUpdate = new Date().toLocaleString();
                    session.prompts.map((_prompt) => {
                      if (_prompt.id === prompt.id) {
                        if (url === "mint") {
                          prompt.isMintReady = true;
                        } else {
                          prompt.isContractReady = true;
                        }
                      }
                      return _prompt;
                    });
                  });
                }
                if (data.sourceCode) {
                  prompt.sourceCode = data.sourceCode;
                  get().updateCurrentSession((session) => {
                    session.lastUpdate = new Date().toLocaleString();
                    session.prompts.map((_prompt) => {
                      if (_prompt.id === prompt.id) {
                        prompt.sourceCode = data.sourceCode;
                      }
                      return _prompt;
                    });
                  });
                }
              }
            },
            onclose: () => {
              ctrl.abort();
              prompt.streaming = false;
              get().updateCurrentSession((session) => {
                session.lastUpdate = new Date().toLocaleString();
                session.prompts.map((_prompt) => {
                  if (_prompt.id === prompt.id) {
                    _prompt.streaming = false;
                  }
                  return _prompt;
                });
              });
            },
            onerror: (error) => {
              ctrl.abort();
              prompt.streaming = false;
              prompt.content =
                "Error fetching response or all credits used up.";
              get().updateCurrentSession((session) => {
                session.lastUpdate = new Date().toLocaleString();
                session.prompts.map((_prompt) => {
                  if (_prompt.id === prompt.id) {
                    _prompt.content =
                      get().isLoggedIn &&
                        get().jwt !== "" &&
                        get()?.credits <= 0
                        ? "All credits used up! Come back tomorrow for more credits."
                        : get()?.credits <= 0
                          ? "You have no credits left. Please Connect your wallet to get more credits."
                          : "Error fetching response";
                    _prompt.streaming = false;
                  }
                  return _prompt;
                });
              });
              throw new Error("Connection error");
            },
          });
        } catch (error) {
          get().isLoggedIn && get().jwt !== "" && get()?.credits <= 0
            ? "All credits used up! Come back tomorrow for more credits."
            : get()?.credits <= 0
              ? "You have no credits left. Please Connect your wallet to get more credits."
              : "Error fetching response";
          return error;
        }
      },
      responseAgentTask: async (task, goal) => {
        try {
          let dataEvent: any = [];
          await fetchEventSource(`${BE_URL}/agent/analyze`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              goal: goal.title,
              task: task.title,
              name: nanoid(),
            }),
            openWhenHidden: true,
            async onopen(response) {
              if (response.status === 429) {
                get().updateCurrentSession((session) => {
                  let currentGoal = session.goals.find(
                    (_goal) => _goal.id === goal.id
                  );
                  let currentTask = currentGoal?.tasks.find(
                    (_task) => _task.id === task.id
                  );
                  if (currentTask) {
                    currentTask.streamingTask = false;
                    currentTask.content = "Content not available!";
                  }
                });
              }
            },
            onmessage: (event) => {
              const data = JSON.parse(event.data);

              data?.isTaskCompleted
                ? dataEvent.push("")
                : dataEvent.push(data?.data);

              let content = dataEvent.join("");
              get().updateCurrentSession((session) => {
                let currentGoal = session.goals.find(
                  (_goal) => _goal.id === goal.id
                );
                let currentTask = currentGoal?.tasks.find(
                  (_task) => _task.id === task.id
                );
                if (currentTask) {
                  currentTask.streamingTask = true;
                  if (data?.isTaskCompleted) {
                    currentTask.streamingTask = false;
                  }
                  currentTask.content = content;
                }
              });
            },
          });
        } catch (error) {
          return error;
        }
      },
      likePrompt: async (prompt, liked) => {
        get().updateCurrentSession((session) => {
          session.lastUpdate = new Date().toLocaleString();
          session.prompts.map((_prompt) => {
            if (_prompt.id === prompt.id) {
              if (_prompt.feedback["liked"] && liked) {
                _prompt.feedback["liked"] = false;
              } else if (_prompt.feedback["disliked"] && liked === false) {
                _prompt.feedback["disliked"] = false;
              } else {
                prompt.feedback = { liked: false, disliked: false };
                liked
                  ? (_prompt.feedback["liked"] = true)
                  : (_prompt.feedback["disliked"] = true);
              }
            }
            return _prompt;
          });
        });
      },
      onNewPrompt: async (prompt) => {
        get().updateCurrentSession((session) => {
          session.lastUpdate = new Date().toLocaleString();
          session.prompts.push(prompt);
          session.topic = session.prompts[0].title;
        });
        prompt.abortPrompt = false;
        prompt.regeneratedResponses = [];
        prompt.loader_links = [];
        prompt.loader_queries = [];
        prompt.fullContentLoaded = false;
        prompt.noCitationsFound = false;
        prompt.noSuggestionsFound = false;
        prompt.isContractReady = false;
        prompt.sources = [];
        prompt.feedback = { liked: false, disliked: false };
        if (prompt.type === "stats")
          get().responsePrompt(prompt, "stats", get().currentSession().id);
        else if (prompt.type === "mint")
          get().responsePrompt(prompt, "mint", get().currentSession().id);
        else if (prompt.type === "faucet")
          get().responsePrompt(prompt, "faucet", get().currentSession().id);
        else if (prompt.type === "tokens")
          get().responsePrompt(prompt, "tokens", get().currentSession().id);
        else get().responsePrompt(prompt, "chat", get().currentSession().id);
      },
      onRegeneratePrompt: async (promptID) => {
        get().updateCurrentSession((session) => {
          session.lastUpdate = new Date().toLocaleString();
          session.topic = session.prompts[0].title;
        });
        let prompt = get()
          .currentSession()
          .prompts.filter((_prompt) => _prompt.id === promptID?.toString())[0];
        console.log("prompt", prompt);
        if (prompt) {
          if (prompt?.content) {
            prompt.regeneratedResponses?.push(prompt.content);
            prompt.content = "";
          }
          prompt.abortPrompt = false;
          prompt.fullContentLoaded = false;
          prompt.noCitationsFound = false;
          prompt.txData = null;
          prompt.isMintReady = false;
          prompt.noSuggestionsFound = false;
          prompt.isContractReady = false;
          prompt.sources = [];
          prompt.loader_links = [];
          prompt.loader_queries = [];
          prompt.feedback = { liked: false, disliked: false };
          if (prompt.type === "stats")
            get().responsePrompt(prompt, "stats", get().currentSession().id);
          else if (prompt.type === "mint")
            get().responsePrompt(prompt, "mint", get().currentSession().id);
          else if (prompt.type === "faucet")
            get().responsePrompt(prompt, "faucet", get().currentSession().id);
          else if (prompt.type === "tokens")
            get().responsePrompt(prompt, "tokens", get().currentSession().id);
          else get().responsePrompt(prompt, "chat", get().currentSession().id);
        }
      },
    }),
    { name: APP_KEY }
  )
);
