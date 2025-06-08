export type BlueprintOSType = "any" | "linux" | "macos" | "windows";

/**
 * Defines a complete blueprint for setting up a development environment for a specific project.
 *
 * A blueprint contains all the necessary configuration to reproduce a consistent development
 * environment across different machines and team members. This includes OS requirements,
 * tool dependencies, project repositories, IDE settings, environment variables, and dotfiles.
 *
 * @example
 * ```typescript
 * const blueprint: BlueprintDefinition = {
 *   projectName: "my-web-app",
 *   description: "Full-stack web application with React frontend and Node.js backend",
 *   version: "1.0.0",
 *   public: false,
 *   authors: {
 *     name: "Development Team",
 *     email: "dev@company.com"
 *   },
 *   tags: ["react", "nodejs", "postgresql"],
 *   os: {
 *     platform: ["linux", "macos"],
 *     minMemoryGB: 8,
 *     requiredTools: [
 *       { name: "node", minVersion: "18.0.0" },
 *       { name: "docker", minVersion: "20.0.0" }
 *     ]
 *   },
 *  repository: {
 *    url: "https://github.com/company/my-web-app.git",
 *    clonePath: "my-web-app"
 *  },
 *   sync: true
 * };
 * ```
 *
 * @see {@link BlueprintOSType} for supported operating system types
 * @since 1.0.0
 */
export interface BlueprintDefinition {
  /**
   * The unique name of the project this blueprint configures.
   * This identifies the specific project (e.g., a codebase, a monorepo, or a collection of services)
   * for which this development environment is being defined.
   * Example: "my-microservice-backend" or "company-monorepo"
   */
  projectName: string;
  /**
   * A concise description of the project and what this blueprint sets up.
   * This helps users understand the project's purpose and the environment provided.
   * Example: "Sets up the core services for the backend application, including Node.js, Docker, and PostgreSQL."
   */
  description?: string;
  /**
   * The version of this blueprint, following semantic versioning (semver) conventions (e.g., "1.0.0").
   * This tracks changes to the blueprint itself and ensures consistency.
   * EnvKit uses this for updates and potential rollback capabilities.
   * - `major`: for incompatible changes (e.g., breaking changes in the blueprint schema).
   * - `minor`: for backward-compatible new features (e.g., adding a new tool or extension).
   * - `patch`: for backward-compatible bug fixes (e.g., correcting an install command).
   * Example: "1.0.0"
   */
  version: string;
  /**
   * Specifies if this blueprint is intended for public sharing on the EnvKit service.
   * If `true`, the blueprint will be discoverable and downloadable by others via `envkit search` and `envkit download`.
   * If `false` or omitted, it remains private to your account on the EnvKit service (if synced).
   */
  public?: boolean;
  /**
   * Information about the author(s) of this blueprint.
   * This provides proper attribution and allows users to contact the creator for support or contributions.
   */
  authors?: {
    /**
     * The name of the author or organization that created the blueprint.
     * Example: "John Doe" or "Acme Corp Dev Team"
     */
    name: string;
    /**
     * The email address of the author, for contact purposes.
     * Example: "john.doe@example.com"
     */
    email: string;
    /**
     * A URL linking to the author's website, GitHub profile, or organization.
     * Example: "https://github.com/johndoe"
     */
    url?: string;
  };
  /**
   * An optional list of tags to categorize the blueprint.
   * These tags can be used for searching and filtering blueprints on the EnvKit service.
   * Example: ["nodejs", "docker", "microservices", "backend"]
   */
  tags?: string[];
  /**
   * Defines operating system-specific requirements and general system configurations needed for *this project*.
   * This ensures the user's OS is compatible and has the necessary foundation for the project's tools.
   */
  os?: {
    /**
     * Specifies the operating systems on which this project's environment is designed to run.
     * EnvKit will check the user's OS against this list.
     * - "any": The project environment is platform-agnostic or handles platform differences internally.
     * - "linux", "macos", "windows": Specific OS targets.
     * Example: ["linux", "macos"] for cross-platform Node.js projects.
     */
    platform: BlueprintOSType[];
    /**
     * The minimum amount of RAM (in gigabytes) required to comfortably run *this project's* development environment.
     * EnvKit can use this to warn users if their system does not meet the minimum memory requirements.
     * Example: 8 // Requires at least 8GB of RAM for the services and tools.
     */
    minMemoryGB?: number;
    /**
     * A script or series of commands to execute on the operating system *after* all `requiredTools` are installed,
     * but *before* project cloning, dotfiles, or other project-specific setup. This is for global OS dependencies needed by the project.
     * Example: "sudo apt update && sudo apt install -y build-essential"
     */
    postInstallScript?: string;
    /**
     * Defines essential tools that must be present and correctly versioned for *this project* to function correctly.
     * EnvKit will check for these tools and offer to install them if missing.
     */
    requiredTools?: Array<{
      /**
       * The common name of the tool (e.g., "git", "node", "docker").
       */
      name: string;
      /**
       * The minimum version required for the tool (e.g., "2.30.0" for Git).
       * EnvKit will compare this to the installed version if detected.
       */
      minVersion?: string;
      /**
       * A specific command to install the tool if it's not found or doesn't meet the `minVersion`.
       * This is crucial for tools not easily managed by common package managers, or for specific versions.
       * Example: "curl -fsSL https://get.docker.com | sh"
       */
      installCommand?: string;
    }>;
    /**
     * Defines recommended tools that enhance *this project's* development experience but are not strictly required.
     * EnvKit can suggest these to the user or offer optional installation.
     */
    recommendedTools?: Array<{
      name: string;
      minVersion?: string;
      installCommand?: string;
    }>;
  };
  /**
   * Defines the primary location where the project's codebases will reside.
   * EnvKit will ensure this directory exists and serve as the base for cloning projects.
   */
  repository?: {
    /**
     * The URL of the project's main repository (e.g., GitHub, GitLab, Bitbucket).
     * This is where the project's codebase can be cloned from.
     * Example: "https:///github.com/company/my-project.git"
     */
    url: string;
    /**
     * The local path where the repository should be cloned.
     * This is relative to the `workspace.path` or absolute.
     * Example: "my-project" // Cloned into ~/Projects/my-project
     */
    clonePath: string;
  };
  /**
   * Defines configuration for integrated development environments (IDEs) relevant to *this project*.
   * These settings will be applied when the blueprint is activated for the project.
   */
  ide?: {
    /**
     * The name of the IDE. Currently, "vscode" is the only supported IDE.
     */
    name: "vscode";
    /**
     * A list of VS Code extension IDs to install.
     * These are extensions specifically useful for *this project's* development.
     * Example: ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint"]
     */
    extensions?: string[];
  };
  /**
   * Defines environment variables required for *this project's* runtime or build processes.
   * EnvKit can manage these (e.g., writing to a .env file within the project, or loading into the shell session).
   */
  environmentVariables?: Record<
    string,
    {
      /**
       * The default value for the environment variable.
       * Can be a literal string or a placeholder requiring user input.
       * Example: "development" or "{{ PROMPT: Enter your API key }}"
       */
      value: string;
      /**
       * A brief description of the environment variable's purpose.
       * Useful when prompting the user for input.
       * Example: "The base URL for the backend API."
       */
      description?: string;
      /**
       * If `true`, this variable contains sensitive information (e.g., API keys, passwords).
       * EnvKit should handle these securely (e.g., not logging values, prompting for input without echoing characters).
       */
      secret?: boolean;
    }
  >;
  /**
   * Specifies dotfiles to be synchronized or managed by EnvKit, specific to *this project's development*.
   * EnvKit will create symbolic links (symlinks) from a source location (usually within the blueprint's context)
   * to the target location (often within the project directory or relevant system config).
   */
  dotfiles?: Array<{
    /**
     * The path to the dotfile relative to the blueprint's root directory.
     * Example: "config/.eslintrc.js" // This would be copied/symlinked into the project's root.
     */
    source: string;
    /**
     * The target path for the dotfile on the user's system, relative to the `workspace.path` or absolute.
     * Example: "./.eslintrc.js" // To be placed in the project root.
     * Example: "~/.gitconfig-my-project" // A project-specific git config.
     */
    target: string;
    /**
     * A brief description of the dotfile's purpose for this project.
     * Example: "Project-specific ESLint configuration."
     */
    description?: string;
    /**
     * Defines the behavior when a file already exists at the target path.
     * - "ask": (Default) Prompt the user to decide whether to overwrite, backup, or skip.
     * - "overwrite": Automatically overwrite the existing file.
     * - "backup": Create a backup of the existing file before overwriting.
     * - "skip": Do not overwrite if the file already exists.
     */
    overwriteStrategy?: "ask" | "overwrite" | "backup" | "skip";
  }>;
  /**
   * Specifies if this blueprint should be synchronized with the EnvKit cloud service.
   * If `true`, EnvKit will attempt to store and update this blueprint in your personal cloud storage.
   * This provides backup and allows access from different machines.
   * This is separate from `public`, which controls discoverability.
   */
  sync: boolean;
}

/**
 * Defines a blueprint configuration for environment management.
 *
 * This function serves as a type-safe factory for creating blueprint definitions,
 * ensuring the provided blueprint configuration conforms to the BlueprintDefinition interface.
 *
 * @param blueprint - The blueprint configuration object containing environment setup instructions
 * @returns The same blueprint definition object, validated and typed
 */
export function defineBlueprint(
  blueprint: BlueprintDefinition,
): BlueprintDefinition {
  return blueprint;
}
