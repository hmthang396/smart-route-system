import { IOutboxRepository, IUserAccountRepository, IUserLoginDataRepository } from "../repositories";

/**
 * IUnitOfWork interface defines a contract for a Unit of Work pattern implementation.
 * The Unit of Work pattern is used to group multiple operations that can be committed
 * together as a single transaction, ensuring data integrity and consistency.
 *
 * This interface provides methods for managing transactions and accessing repositories
 * related to user accounts and user login data.
 */

export interface IUnitOfWork {
  /**
   * Executes a given work function within a transaction.
   * This method ensures that all operations within the function
   * are executed as a single unit. If any operation fails, the transaction
   * can be rolled back to maintain data integrity.
   *
   * @param work - A function that contains the transactional work to be done.
   * @returns A promise that resolves to the result of the work function.
   * @throws An error if the transaction fails or is rolled back.
   */
  doTransactional<W>(work: () => W | Promise<W>): Promise<W>;
  /**
   * Retrieves the transaction manager used to handle transactions.
   * This can be used to control transaction states, such as committing or rolling back.
   *
   * @returns An unknown type representing the transaction manager.
   * This type should be specified in the implementation.
   */
  getTransactionManager(): unknown;
  /**
   * Gets the user account repository for accessing and managing user account data.
   *
   * @returns An instance of IUserAccountRepository for user account operations.
   */
  getUserAccountRepository(): IUserAccountRepository;
  /**
   * Gets the user login data repository for accessing and managing user login data.
   *
   * @returns An instance of IUserLoginDataRepository for user login operations.
   */
  getUserLoginDataRepository(): IUserLoginDataRepository;
  /**
   * Gets the outbox repository for accessing and managing outbox.
   *
   * @returns An instance of IOutboxRepository for outbox operations.
   */
  getOutboxRepository(): IOutboxRepository;
}
