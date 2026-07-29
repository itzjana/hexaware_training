from controllers.auth_controller import AuthController
from controllers.admin_controller import AdminController
from enums import Role, JobTitle, VehicleCategory, FuelType, VehicleUsage

auth_controller = AuthController()
admin_controller = AdminController()
CURRENT_USER = None

def is_session_active():
    global CURRENT_USER
    if not CURRENT_USER:
        return False
    # Validate session from session file
    session_user = auth_controller.get_auto_session()
    if not session_user or session_user.email != CURRENT_USER.email:
        CURRENT_USER = None
        print("\n[SESSION TIMEOUT/INVALID] Session expired or invalid. Please login again.")
        return False
    return True

def handle_admin_dashboard():
    global CURRENT_USER
    while CURRENT_USER and CURRENT_USER.role == Role.ADMIN.value:
        # Session check before navigating/showing options
        if not is_session_active():
            break

        print(f"\n=========================================")
        print(f"   ADMIN DASHBOARD - WELCOME {CURRENT_USER.username.upper()}")
        print(f"=========================================")
        print("1. Create Insurance Policy")
        print("2. Deactivate (Soft Delete) Insurance Policy")
        print("3. View Insurance Policies")
        print("4. Create Policy Add-On")
        print("5. Deactivate (Soft Delete) Policy Add-On")
        print("6. View Policy Add-Ons")
        print("7. Onboard (Register) Insurance Officer")
        print("8. Logout")

        try:
            choice = int(input("Enter choice: "))
            # Check session again before executing the choice
            if not is_session_active():
                break

            match choice:
                case 1:
                    print("\n--- Create Insurance Policy ---")
                    name = input("Enter Policy Name: ").strip()
                    description = input("Enter Description: ").strip()
                    base_rate = float(input("Enter Base Rate: "))
                    validity_months = int(input("Enter Validity (Months): "))
                    
                    print("\nSelect Vehicle Category:")
                    categories = list(VehicleCategory)
                    for idx, cat in enumerate(categories, 1):
                        print(f"{idx}. {cat.value}")
                    cat_choice = int(input("Enter choice: "))
                    vehicle_category = categories[cat_choice - 1].value

                    print("\nSelect Vehicle Usage:")
                    usages = list(VehicleUsage)
                    for idx, usage in enumerate(usages, 1):
                        print(f"{idx}. {usage.value}")
                    usage_choice = int(input("Enter choice: "))
                    vehicle_usage = usages[usage_choice - 1].value

                    print("\nSelect Fuel Type:")
                    fuels = list(FuelType)
                    for idx, fuel in enumerate(fuels, 1):
                        print(f"{idx}. {fuel.value}")
                    fuel_choice = int(input("Enter choice: "))
                    fuel_type = fuels[fuel_choice - 1].value

                    admin_controller.create_insurance_policy(
                        name=name,
                        description=description,
                        base_rate=base_rate,
                        validity_months=validity_months,
                        vehicle_category=vehicle_category,
                        vehicle_usage=vehicle_usage,
                        fuel_type=fuel_type
                    )

                case 2:
                    print("\n--- Deactivate (Soft Delete) Insurance Policy ---")
                    policy_id = int(input("Enter Policy ID to deactivate: "))
                    admin_controller.soft_delete_insurance_policy(policy_id)

                case 3:
                    print("\n--- View Insurance Policies ---")
                    inc_inactive = input("Include inactive policies? (y/n): ").strip().lower() == 'y'
                    policies = admin_controller.list_insurance_policies(include_inactive=inc_inactive)
                    if not policies:
                        print("No insurance policies found.")
                    else:
                        print("\nID  | Name                 | Rate      | Months | Category   | Active")
                        print("-" * 75)
                        for p in policies:
                            print(f"{p.id:<3} | {p.policy_name:<20} | {p.base_rate:<9.2f} | {p.validity_months:<6} | {p.vehicle_category:<10} | {p.active}")

                case 4:
                    print("\n--- Create Policy Add-On ---")
                    name = input("Enter Add-On Name: ").strip()
                    description = input("Enter Description: ").strip()
                    cost = float(input("Enter Additional Cost: "))
                    admin_controller.create_policy_add_on(name, description, cost)

                case 5:
                    print("\n--- Deactivate (Soft Delete) Policy Add-On ---")
                    addon_id = int(input("Enter Add-On ID to deactivate: "))
                    admin_controller.soft_delete_policy_add_on(addon_id)

                case 6:
                    print("\n--- View Policy Add-Ons ---")
                    inc_inactive = input("Include inactive add-ons? (y/n): ").strip().lower() == 'y'
                    addons = admin_controller.list_policy_add_ons(include_inactive=inc_inactive)
                    if not addons:
                        print("No policy add-ons found.")
                    else:
                        print("\nID  | Name                 | Cost      | Active")
                        print("-" * 50)
                        for a in addons:
                            print(f"{a.id:<3} | {a.name:<20} | {a.additional_cost:<9.2f} | {a.active}")

                case 7:
                    print("\n--- Onboard (Register) Insurance Officer ---")
                    username = input("Enter Username: ").strip()
                    email = input("Enter Email: ").strip()
                    name = input("Enter Full Name: ").strip()
                    
                    print("\nSelect Job Title:")
                    job_titles = list(JobTitle)
                    for idx, jt in enumerate(job_titles, 1):
                        print(f"{idx}. {jt.value}")
                    jt_choice = int(input("Enter choice: "))
                    job_title = job_titles[jt_choice - 1].value

                    auth_controller.officer_signup(
                        username=username,
                        email=email,
                        name=name,
                        job_title=job_title
                    )

                case 8:
                    auth_controller.logout(CURRENT_USER.email)
                    CURRENT_USER = None
                    print("\nLogout successful.")
                    break
                case _:
                    print("\nInvalid selection.")
        except (ValueError, IndexError):
            print("[ERROR] Invalid Input. Please try again.")

def show_role_dashboard(user):
    global CURRENT_USER
    if user.role == Role.ADMIN.value:
        handle_admin_dashboard()
    else:
        while CURRENT_USER:
            # Check session presence before navigating/displaying options
            if not is_session_active():
                break
            print(f"\n=========================================")
            print(f"   WELCOME {CURRENT_USER.username.upper()} ({CURRENT_USER.role})")
            print(f"=========================================")
            print(f"You are logged in successfully.")
            print(f"Role-specific features will be loaded here.")
            print(f"1. Logout")
            
            try:
                choice = int(input("Enter your choice: "))
                # Check session again before executing
                if not is_session_active():
                    break
                if choice == 1:
                    auth_controller.logout(CURRENT_USER.email)
                    CURRENT_USER = None
                    print("\nLogout successful.")
                    break
                else:
                    print("\nInvalid selection.")
            except ValueError:
                print("[ERROR] Invalid Input. Please try again.")

def run_main():
    global CURRENT_USER
    print("---------------------------------------------")
    print("Welcome to CapeStone Insurance Management System")
    print("---------------------------------------------")

    # Auto session login check
    auto_user = auth_controller.get_auto_session()
    if auto_user:
        CURRENT_USER = auto_user
        print(f"\n[SESSION AUTO LOGIN] Welcome back: {CURRENT_USER.username}")
        show_role_dashboard(CURRENT_USER)

    while True:
        print("\n========== MAIN MENU ==========")
        print("1. Login")
        print("2. Register Customer")
        print("3. Register Admin")
        print("4. Exit")

        try:
            choice = int(input("Enter choice: "))
            match choice:
                case 1:
                    username = input("Enter Username: ").strip()
                    password = input("Enter Password: ").strip()
                    login_result = auth_controller.login(username, password)
                    if login_result:
                        CURRENT_USER = login_result[0]
                        show_role_dashboard(CURRENT_USER)

                case 2:
                    print("\n--- Customer Signup ---")
                    username = input("Enter Username: ").strip()
                    email = input("Enter Email: ").strip()
                    password = input("Enter Password: ").strip()
                    name = input("Enter Full Name: ").strip()
                    dob = input("Enter Date of Birth (YYYY-MM-DD): ").strip()
                    address = input("Enter Address: ").strip()
                    aadhar = input("Enter Aadhaar Number: ").strip()
                    pan = input("Enter PAN Number: ").strip()

                    auth_controller.customer_signup(
                        username=username,
                        email=email,
                        password=password,
                        name=name,
                        dob=dob,
                        address=address,
                        aadhar_number=aadhar,
                        pan_number=pan
                    )

                case 3:
                    print("\n--- Admin Signup ---")
                    username = input("Enter Username: ").strip()
                    email = input("Enter Email: ").strip()
                    password = input("Enter Password: ").strip()
                    auth_controller.admin_signup(username, email, password)

                case 4:
                    print("\nExiting Application. Thank you.")
                    break

                case _:
                    print("Invalid choice selection.")

        except ValueError:
            print("[ERROR] Verification rejected due to invalid input.")

if __name__ == "__main__":
    run_main()
