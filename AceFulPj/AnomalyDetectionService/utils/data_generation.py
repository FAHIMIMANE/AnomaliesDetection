import requests
import random
import datetime
import time

# Constants
VEHICLE_SERVICE_URL = "http://localhost:8081/vehicles"
TRAJECTORY_API_URL = "http://localhost:8081/api/trajectories/trajectories"
GOOGLE_MAPS_API_KEY = "AIzaSyBqGDXVFu8z386xLHiQjIh6S1qP7kwEEB0"

# Fetch vehicles
def fetch_vehicles():
    response = requests.get(VEHICLE_SERVICE_URL)
    return response.json() if response.status_code == 200 else []

# Fetch a realistic route once and cache it
def get_realistic_route(api_key, start, end):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    params = {"origin": f"{start[0]},{start[1]}", "destination": f"{end[0]},{end[1]}", "key": api_key}
    response = requests.get(url, params=params)
    if response.status_code == 200 and response.json()['status'] == 'OK':
        return response.json()['routes'][0]['legs'][0]['steps']
    return []

# Generate trajectory points
def generate_trajectory(vehicle_id, route, total_points=5000):
    trajectories = []
    days_to_go_back = 150  # Approximately 5 months

    # Divide data into multiple trajectories
    points_per_trajectory = total_points // 50  # ~50 trajectories with 100 points each
    for _ in range(50):  # Create 50 trajectories
        start_time = datetime.datetime.now() - datetime.timedelta(days=random.randint(1, days_to_go_back))
        timestamp = start_time

        for _ in range(points_per_trajectory):
            step = route[random.randint(0, len(route) - 1)]['start_location']
            speed = random.uniform(40, 60)
            status = "on_route"

            # Inject anomalies
            if random.random() < 0.07:  # 7% anomaly chance
                anomaly_type = random.choice(["stop", "delay", "deviation"])
                if anomaly_type == "stop":
                    speed = 0
                    status = "stopped"
                elif anomaly_type == "delay":
                    timestamp += datetime.timedelta(minutes=random.randint(5, 15))
                    status = "delayed"
                else:
                    step['lat'] += random.uniform(0.01, 0.05)
                    step['lng'] += random.uniform(0.01, 0.05)
                    status = "off_route"

            trajectories.append({
                "vehicle": {"id": vehicle_id},
                "latitude": step['lat'],
                "longitude": step['lng'],
                "speed": speed,
                "heading": random.randint(0, 360),
                "timestamp": timestamp.isoformat(),
                "startTime": start_time.isoformat(),
                "status": status
            })
            timestamp += datetime.timedelta(seconds=10)  # Increment time

    return trajectories

# Post trajectories in batches
def post_trajectories_in_batches(trajectories, batch_size=500):
    for i in range(0, len(trajectories), batch_size):
        batch = trajectories[i:i + batch_size]
        try:
            response = requests.post(TRAJECTORY_API_URL, json=batch)
            if response.status_code == 200:
                print(f"Batch {i // batch_size + 1} sent successfully.")
            else:
                print(f"Error sending batch {i // batch_size + 1}: {response.status_code}")
        except Exception as e:
            print(f"Failed to send batch {i // batch_size + 1}: {e}")

def main():
    print("Fetching vehicles...")
    vehicles = fetch_vehicles()
    if not vehicles:
        print("No vehicles found.")
        return

    # Define a fixed route for all vehicles
    start_location = [40.7128, -74.0060]  # NYC
    end_location = [40.7306, -73.9352]    # Brooklyn
    print("Fetching route...")
    route = get_realistic_route(GOOGLE_MAPS_API_KEY, start_location, end_location)

    if not route:
        print("Failed to fetch route.")
        return

    # Generate and post trajectories for each vehicle
    for vehicle in vehicles:
        print(f"Generating data for vehicle ID: {vehicle['id']}")
        trajectories = generate_trajectory(vehicle['id'], route)
        print(f"Generated {len(trajectories)} points for vehicle ID {vehicle['id']}.")
        post_trajectories_in_batches(trajectories)
    print("Data generation complete.")

if __name__ == "__main__":
    main()
