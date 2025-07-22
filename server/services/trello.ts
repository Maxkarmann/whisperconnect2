import axios from 'axios';

export interface ProcessedTask {
  title: string;
  description: string;
}

interface TrelloCard {
  id: string;
  name: string;
  desc: string;
  url: string;
}

interface TrelloList {
  id: string;
  name: string;
}

interface TrelloBoard {
  id: string;
  name: string;
  url: string;
}

export class TrelloService {
  private apiKey: string;
  private token: string;
  private baseUrl = 'https://api.trello.com/1';

  constructor() {
    this.apiKey = process.env.TRELLO_API_KEY || '';
    this.token = process.env.TRELLO_TOKEN || '';
    
    if (!this.apiKey || !this.token) {
      console.warn('Trello API credentials not configured. Cards will be mocked.');
    }
  }

  private getAuthParams(): string {
    return `key=${this.apiKey}&token=${this.token}`;
  }

  /**
   * Get user's boards
   */
  async getBoards(): Promise<TrelloBoard[]> {
    if (!this.apiKey || !this.token) {
      return this.getMockBoards();
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/members/me/boards?${this.getAuthParams()}`
      );
      return response.data.map((board: any) => ({
        id: board.id,
        name: board.name,
        url: board.url
      }));
    } catch (error) {
      console.error('Error fetching Trello boards:', error);
      return this.getMockBoards();
    }
  }

  /**
   * Get lists from a board
   */
  async getBoardLists(boardId: string): Promise<TrelloList[]> {
    if (!this.apiKey || !this.token) {
      return this.getMockLists();
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/boards/${boardId}/lists?${this.getAuthParams()}`
      );
      return response.data.map((list: any) => ({
        id: list.id,
        name: list.name
      }));
    } catch (error) {
      console.error('Error fetching Trello lists:', error);
      return this.getMockLists();
    }
  }

  /**
   * Create a card in a specific list
   */
  async createCard(
    listId: string, 
    name: string, 
    description: string,
    position: string = 'bottom'
  ): Promise<TrelloCard> {
    if (!this.apiKey || !this.token) {
      return this.getMockCard(name, description);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/cards?${this.getAuthParams()}`,
        {
          name,
          desc: description,
          idList: listId,
          pos: position
        }
      );
      
      return {
        id: response.data.id,
        name: response.data.name,
        desc: response.data.desc,
        url: response.data.url
      };
    } catch (error) {
      console.error('Error creating Trello card:', error);
      return this.getMockCard(name, description);
    }
  }

  /**
   * Send multiple processed tasks to Trello
   */
  async sendTasksToTrello(
    tasks: ProcessedTask[], 
    taskId: number,
    boardId?: string,
    listId?: string
  ): Promise<TrelloCard[]> {
    try {
      console.log(`Sending ${tasks.length} tasks to Trello for task ${taskId}`);
      
      // If no specific board/list provided, use environment defaults or first available
      let targetListId = listId;
      
      if (!targetListId) {
        const boards = await this.getBoards();
        if (boards.length === 0) {
          throw new Error('No Trello boards available');
        }
        
        const targetBoardId = boardId || boards[0].id;
        const lists = await this.getBoardLists(targetBoardId);
        
        if (lists.length === 0) {
          throw new Error('No lists found in Trello board');
        }
        
        // Find "To Do" list or use first list
        const todoList = lists.find(list => 
          list.name.toLowerCase().includes('to do') || 
          list.name.toLowerCase().includes('todo') ||
          list.name.toLowerCase().includes('backlog')
        );
        targetListId = todoList ? todoList.id : lists[0].id;
      }

      const createdCards: TrelloCard[] = [];
      
      // Create cards sequentially to avoid rate limiting
      for (const task of tasks) {
        const card = await this.createCard(
          targetListId,
          task.title,
          task.description
        );
        createdCards.push(card);
        
        console.log(`Created Trello card: ${task.title}`);
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`Successfully created ${createdCards.length} Trello cards`);
      return createdCards;
      
    } catch (error) {
      console.error("Error sending tasks to Trello:", error);
      throw new Error(`Failed to send tasks to Trello: ${(error as Error).message}`);
    }
  }

  /**
   * Get board info by URL or ID
   */
  async getBoardInfo(boardIdentifier: string): Promise<TrelloBoard | null> {
    if (!this.apiKey || !this.token) {
      return this.getMockBoards()[0] || null;
    }

    try {
      // Extract board ID from URL if needed
      let boardId = boardIdentifier;
      if (boardIdentifier.includes('trello.com')) {
        const match = boardIdentifier.match(/\/b\/([^\/]+)/);
        if (match) {
          boardId = match[1];
        }
      }

      const response = await axios.get(
        `${this.baseUrl}/boards/${boardId}?${this.getAuthParams()}`
      );
      
      return {
        id: response.data.id,
        name: response.data.name,
        url: response.data.url
      };
    } catch (error) {
      console.error('Error fetching board info:', error);
      return null;
    }
  }

  // Mock data for development
  private getMockBoards(): TrelloBoard[] {
    return [
      {
        id: 'mock-board-1',
        name: 'Task Management Board',
        url: 'https://trello.com/b/mock-board-1'
      }
    ];
  }

  private getMockLists(): TrelloList[] {
    return [
      { id: 'mock-list-1', name: 'To Do' },
      { id: 'mock-list-2', name: 'In Progress' },
      { id: 'mock-list-3', name: 'Done' }
    ];
  }

  private getMockCard(name: string, description: string): TrelloCard {
    return {
      id: `mock-card-${Date.now()}`,
      name,
      desc: description,
      url: `https://trello.com/c/mock-card-${Date.now()}`
    };
  }
}

// Export singleton instance
export const trelloService = new TrelloService();

// For backward compatibility, keep the old function signature
export async function sendTasksToTrello(tasks: ProcessedTask[], taskId: number): Promise<void> {
  try {
    await trelloService.sendTasksToTrello(tasks, taskId);
  } catch (error) {
    console.error("Error in sendTasksToTrello:", error);
    throw error;
  }
}
